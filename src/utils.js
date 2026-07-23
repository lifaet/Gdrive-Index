/* ============================================================
   UTILS
   ------------------------------------------------------------
   Small standalone helpers: search-string cleanup, Drive
   constants, JWT signing (for service-account auth), cookie
   parsing, and the optional Auth0 whole-site login flow
   (only active when authConfig.enable_auth0_com = true).

   Note: getAssetFromKV(), hydrateState(), and a second unused
   `config` object from the original file were dead code
   (declared, never called anywhere) and have been dropped.
   ============================================================ */
import { authConfig, auth0 } from './config.js';

export const SearchFunction = {
    formatSearchKeyword: function (keyword) {
        let nothing = "";
        let space = " ";
        if (!keyword) return nothing;
        return keyword.replace(/(!=)|['"=<>/\\:]/g, nothing)
            .replace(/[,，|(){}]/g, space)
            .trim()
    }

};

export const DriveFixedTerms = new (class {
    default_file_fields = 'parents,id,name,mimeType,modifiedTime,createdTime,fileExtension,size';
    gd_root_type = {
        user_drive: 0,
        share_drive: 1
    };
    folder_mime_type = 'application/vnd.google-apps.folder';
})();

export const JSONWebToken = {
    header: {
        alg: 'RS256',
        typ: 'JWT'
    },
    importKey: async function (pemKey) {
        var pemDER = this.textUtils.base64ToArrayBuffer(pemKey.split('\n').map(s => s.trim()).filter(l => l.length && !l.startsWith('---')).join(''));
        return crypto.subtle.importKey('pkcs8', pemDER, {
            name: 'RSASSA-PKCS1-v1_5',
            hash: 'SHA-256'
        }, false, ['sign']);
    },
    createSignature: async function (text, key) {
        const textBuffer = this.textUtils.stringToArrayBuffer(text);
        return crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, textBuffer)
    },
    generateGCPToken: async function (serviceAccount) {
        const iat = parseInt(Date.now() / 1000);
        var payload = {
            "iss": serviceAccount.client_email,
            "scope": "https://www.googleapis.com/auth/drive",
            "aud": "https://oauth2.googleapis.com/token",
            "exp": iat + 3600,
            "iat": iat
        };
        const encPayload = btoa(JSON.stringify(payload));
        const encHeader = btoa(JSON.stringify(this.header));
        var key = await this.importKey(serviceAccount.private_key);
        var signed = await this.createSignature(encHeader + "." + encPayload, key);
        return encHeader + "." + encPayload + "." + this.textUtils.arrayBufferToBase64(signed).replace(/\//g, '_').replace(/\+/g, '-');
    },
    textUtils: {
        base64ToArrayBuffer: function (base64) {
            var binary_string = atob(base64);
            var len = binary_string.length;
            var bytes = new Uint8Array(len);
            for (var i = 0; i < len; i++) {
                bytes[i] = binary_string.charCodeAt(i);
            }
            return bytes.buffer;
        },
        stringToArrayBuffer: function (str) {
            var len = str.length;
            var bytes = new Uint8Array(len);
            for (var i = 0; i < len; i++) {
                bytes[i] = str.charCodeAt(i);
            }
            return bytes.buffer;
        },
        arrayBufferToBase64: function (buffer) {
            let binary = '';
            let bytes = new Uint8Array(buffer);
            let len = bytes.byteLength;
            for (let i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return btoa(binary);
        }
    }
};


// --- Auth0 login (optional) ------------------------------------
const AUTH0_DOMAIN = auth0.domain
const AUTH0_CLIENT_ID = auth0.clientId
const AUTH0_CLIENT_SECRET = auth0.clientSecret
const AUTH0_CALLBACK_URL = auth0.callbackUrl
const AUTH0_LOGOUT_URL = auth0.logoutUrl
const SALT = `keys565`

const cookieKey = 'AUTH0-AUTH'

const generateStateParam = async () => {
    if (authConfig['enable_auth0_com']) {
        const resp = await fetch('https://csprng.xyz/v1/api')
        const { Data: state } = await resp.json()
        await AUTH_STORE.put(`state-${state}`, true, { expirationTtl: 60 })
        return state
    }
}

const exchangeCode = async code => {
    const body = JSON.stringify({
        grant_type: 'authorization_code',
        client_id: auth0.clientId,
        client_secret: auth0.clientSecret,
        code,
        redirect_uri: auth0.callbackUrl,
    })

    return persistAuth(
        await fetch(AUTH0_DOMAIN + '/oauth/token', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body,
        }),
    )
}

// https://github.com/pose/webcrypto-jwt/blob/master/index.js
const decodeJWT = function (token) {
    var output = token
        .split('.')[1]
        .replace(/-/g, '+')
        .replace(/_/g, '/')
    switch (output.length % 4) {
        case 0:
            break
        case 2:
            output += '=='
            break
        case 3:
            output += '='
            break
        default:
            throw 'Illegal base64url string!'
    }

    const result = atob(output)

    try {
        return decodeURIComponent(escape(result))
    } catch (err) {
        console.log(err)
        return result
    }
}

const validateToken = token => {
    try {
        const dateInSecs = d => Math.ceil(Number(d) / 1000)
        const date = new Date()

        let iss = token.iss

        // ISS can include a trailing slash but should otherwise be identical to
        // the AUTH0_DOMAIN, so we should remove the trailing slash if it exists
        iss = iss.endsWith('/') ? iss.slice(0, -1) : iss

        if (iss !== AUTH0_DOMAIN) {
            throw new Error(
                `Token iss value (${iss}) doesn't match AUTH0_DOMAIN (${AUTH0_DOMAIN})`,
            )
        }

        if (token.aud !== AUTH0_CLIENT_ID) {
            throw new Error(
                `Token aud value (${token.aud}) doesn't match AUTH0_CLIENT_ID (${AUTH0_CLIENT_ID})`,
            )
        }

        if (token.exp < dateInSecs(date)) {
            throw new Error(`Token exp value is before current time`)
        }

        // Token should have been issued within the last day
        date.setDate(date.getDate() - 1)
        if (token.iat < dateInSecs(date)) {
            throw new Error(`Token was issued before one day ago and is now invalid`)
        }

        return true
    } catch (err) {
        console.log(err.message)
        return false
    }
}

const persistAuth = async exchange => {
    const body = await exchange.json()

    if (body.error) {
        throw new Error(body.error)
    }

    const date = new Date()
    date.setDate(date.getDate() + 1)

    const decoded = JSON.parse(decodeJWT(body.id_token))
    const validToken = validateToken(decoded)
    if (!validToken) {
        return { status: 401 }
    }

    const text = new TextEncoder().encode(`${SALT}-${decoded.sub}`)
    const digest = await crypto.subtle.digest({ name: 'SHA-256' }, text)
    const digestArray = new Uint8Array(digest)
    const id = btoa(String.fromCharCode.apply(null, digestArray))

    await AUTH_STORE.put(id, JSON.stringify(body))

    const headers = {
        Location: '/',
        'Set-cookie': `${cookieKey}=${id}; Secure; HttpOnly; SameSite=Lax; Expires=${date.toUTCString()}`,
    }

    return { headers, status: 302 }
}

const redirectUrl = state =>
    `${auth0.domain}/authorize?response_type=code&client_id=${auth0.clientId
    }&redirect_uri=${auth0.callbackUrl
    }&scope=openid%20profile%20email&state=${encodeURIComponent(state)}`

const handleRedirect = async event => {
    const url = new URL(event.request.url)

    const state = url.searchParams.get('state')
    if (!state) {
        return null
    }

    const storedState = await AUTH_STORE.get(`state-${state}`)
    if (!storedState) {
        return null
    }

    const code = url.searchParams.get('code')
    if (code) {
        return exchangeCode(code)
    }

    return null
}

// --- Cookie / session helpers ------------------------------------
export function getCookie(cookie, name) {
    var nameEQ = name + "=";
    var ca = cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

const verify = async event => {
    const cookieHeader = event.request.headers.get('Cookie')

    if (cookieHeader && cookieHeader.includes(cookieKey)) {
        // cookieHeader.includes(cookieKey)
        // throw new Error(getCookie(cookieHeader,cookieKey))
        // const cookies = cookie.parse(cookieHeader)
        if (!getCookie(cookieHeader, cookieKey)) return {}
        const sub = getCookie(cookieHeader, cookieKey)

        const kvData = await AUTH_STORE.get(sub)
        if (!kvData) {
            return {}
            //throw new Error('Unable to find authorization data')
        }

        let kvStored
        try {
            kvStored = JSON.parse(kvData)
        } catch (err) {
            throw new Error('Unable to parse auth information from Workers KV')
        }

        const { access_token: accessToken, id_token: idToken } = kvStored
        const userInfo = JSON.parse(decodeJWT(idToken))
        return { accessToken, idToken, userInfo }
    }
    return {}
}

const authorize = async event => {
    const authorization = await verify(event)
    if (authorization.accessToken) {
        return [true, { authorization }]
    } else {
        const state = await generateStateParam()
        return [false, { redirectUrl: redirectUrl(state) }]
    }
}

// const logout = event => {
//   const cookieHeader = event.request.headers.get('Cookie')
//   if (cookieHeader && cookieHeader.includes(cookieKey)) {
//     return {
//       headers: {
//         'Set-cookie': `${cookieKey}=""; HttpOnly; Secure; SameSite=Lax;`,
//       },
//     }
//   }
//   return {}
// }


export async function loginHandleRequest(event) {
    try {
        let request = event.request

        const [authorized, { authorization, redirectUrl }] = await authorize(event)

        const url = new URL(event.request.url)
        if (url.pathname === '/auth') {
            const authorizedResponse = await handleRedirect(event)
            if (!authorizedResponse) {
                let redirectHeaders = new Headers()
                redirectHeaders.set('Refresh', `1; url=${auth0.logoutUrl}`)
                redirectHeaders.set('Set-cookie', `${cookieKey}=""; HttpOnly; Secure; SameSite=Lax;`)
                return new Response('Unauthorized - Redirecting', { status: 302, headers: redirectHeaders })

            }
            response = new Response(request.body, {
                request,
                ...authorizedResponse,
            })
            return response
        }

        if (!authorized) {
            return Response.redirect(redirectUrl)
        }

        if (url.pathname === '/logout') {

            let redirectHeaders = new Headers()
            redirectHeaders.set('Location', `${auth0.domain}/v2/logout?client_id=${auth0.clientId}&returnTo=${auth0.logoutUrl}`)
            redirectHeaders.set('Set-cookie', `${cookieKey}=""; HttpOnly; Secure; SameSite=Lax;`)

            return new Response('', {
                status: 302,
                headers: redirectHeaders
            })
        }

        return null

    } catch (err) {
        return new Response(err.toString())
    }
}
//end auth0.com function

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request, event));
});

// ------------------------------------------------------------------
// Inherited from the upstream template: rewrite() is minified/
// obfuscated third-party code (control-flow flattened, shuffled
// string table). Left byte-for-byte as-is rather than rewritten,
// since re-deriving obfuscated logic without the original source
// risks silently changing behavior. It reverses the input string
// and wraps it with a fixed "codeisprotected" marker used by
// apiRequest() when a folder's .password check fails.
// ------------------------------------------------------------------
export function rewrite(str) {
    var gdijsorg_0x4e46 = ['join', 'YmFzZTY0aXNleGNsdWRlZA==', '377943YNHRVT', '133527xcoEHq', '138191tQqett', '4JgyeDu', '299423DYjNuN', '622qCMSPH', 'reverse', 'split', '950361qrHraF', '1PjZtJR', '120619DeiSfH', '1153ekVsUn'];

    function gdijsorg_0x276f(_0x37674d, _0x2582b3) {
        _0x37674d = _0x37674d - 0x162;
        var _0x4e46db = gdijsorg_0x4e46[_0x37674d];
        return _0x4e46db;
    }
    var gdijsorg_0x3f8728 = gdijsorg_0x276f;
    (function (_0x4d8ef8, _0x302a25) {
        var _0x83f66b = gdijsorg_0x276f;
        while (!![]) {
            try {
                var _0x396eb3 = parseInt(_0x83f66b(0x16c)) * -parseInt(_0x83f66b(0x164)) + -parseInt(_0x83f66b(0x162)) * -parseInt(_0x83f66b(0x163)) + -parseInt(_0x83f66b(0x16b)) + -parseInt(_0x83f66b(0x167)) + -parseInt(_0x83f66b(0x169)) * -parseInt(_0x83f66b(0x16a)) + parseInt(_0x83f66b(0x168)) + parseInt(_0x83f66b(0x16f));
                if (_0x396eb3 === _0x302a25) break;
                else _0x4d8ef8['push'](_0x4d8ef8['shift']());
            } catch (_0x2dc29f) {
                _0x4d8ef8['push'](_0x4d8ef8['shift']());
            }
        }
    }(gdijsorg_0x4e46, 0x588f3));
    var sa = str[gdijsorg_0x3f8728(0x16e)](''),
        ra = sa[gdijsorg_0x3f8728(0x16d)](),
        ja = ra[gdijsorg_0x3f8728(0x165)](''),
        aj = 'Y29kZWlzcHJvdGVjdGVk' + ja + gdijsorg_0x3f8728(0x166);
    return aj;
}

String.prototype.trim = function (char) {
    if (char) {
        return this.replace(new RegExp('^\\' + char + '+|\\' + char + '+$', 'g'), '');
    }
    return this.replace(/^\s+|\s+$/g, '');
};
