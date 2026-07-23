/* ============================================================
   TEMPLATES
   ------------------------------------------------------------
   All page HTML as template strings — no separate .html files.
   These are plain string interpolations of config.js values.
   ============================================================ */
import { authConfig, uiConfig } from './config.js';

export function html(current_drive_order = 0, model = {}) {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0,maximum-scale=1.0, user-scalable=no"/>
  <title>${authConfig.siteName}</title>
  <script async src="https://arc.io/widget.min.js#${uiConfig.arc_code}"></script>
  <meta name="robots" content="noindex" />
  <link rel="icon" href="${uiConfig.favicon}">
  <script>
    window.drive_names = JSON.parse('${JSON.stringify(authConfig.roots.map(it => it.name))}');
    window.MODEL = JSON.parse('${JSON.stringify(model)}');
    window.current_drive_order = ${current_drive_order};
    window.UI = JSON.parse('${JSON.stringify(uiConfig)}');
  </script>
  <script src="https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js"></script>
  <link rel="stylesheet" href="https://cdn.plyr.io/${uiConfig.plyr_io_version}/plyr.css" />
  <link href="https://cdn.jsdelivr.net/npm/bootswatch@5.0.0/dist/${uiConfig.theme}/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">
  <style>a{color:${uiConfig.css_a_tag_color};}p{color:${uiConfig.css_p_tag_color};}</style>
  <script src="${uiConfig.jsdelivr_cdn_src}@${uiConfig.version}/js/app.obf.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/pdfjs-dist@2.12.313/build/pdf.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/marked@4.0.0/marked.min.js"></script>
</head>
<body>
</body>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-p34f1UUtsS3wqzfto5wAAmdvj+osOnFyQFpp4Ua3gs/ZVWx6oOypYoCJhGGScy+8" crossorigin="anonymous"></script>
  <script src="https://cdn.plyr.io/${uiConfig.plyr_io_version}/plyr.polyfilled.js"></script>
</html>`;
};

export const homepage = `<!DOCTYPE html>
<html>
   <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0,maximum-scale=1.0, user-scalable=no">
      <title>${authConfig.siteName}</title>
      <meta name="robots" content="noindex">
      <link rel="icon" href="${uiConfig.favicon}">
      <script>
          window.drive_names = JSON.parse('${JSON.stringify(authConfig.roots.map(it => it.name))}');
          window.UI = JSON.parse('${JSON.stringify(uiConfig)}');
      </script>
      <script src="https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js"></script>
      <link rel="stylesheet" href="https://cdn.plyr.io/${uiConfig.plyr_io_version}/plyr.css" />
      <link href="https://cdn.jsdelivr.net/npm/bootswatch@5.0.0/dist/${uiConfig.theme}/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">
      <style>a{color:${uiConfig.css_a_tag_color};}p{color:${uiConfig.css_p_tag_color};}</style>
   </head>
   <body>
      <header>
         <div id="nav">
            <nav class="navbar navbar-expand-lg${uiConfig.fixed_header ? ' fixed-top' : ''} ${uiConfig.header_style_class}">
               <div class="container-fluid">
                 <a class="navbar-brand" href="https://lifaet.github.io/">${uiConfig.logo_image ? '<img border="0" alt="' + uiConfig.company_name + '" src="' + uiConfig.logo_link_name + '" height="' + uiConfig.height + '" width="' + uiConfig.logo_width + '">' : uiConfig.logo_link_name}</a>
                  <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                  <span class="navbar-toggler-icon"></span>
                  </button>
                  <div class="collapse navbar-collapse" id="navbarSupportedContent">
                     <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                          <a class="nav-link" href="/">${uiConfig.nav_link_1}</a>
                        </li>
                        <li class="nav-item dropdown">
                           <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Current Path</a>
                           <div class="dropdown-menu" aria-labelledby="navbarDropdown"><a class="dropdown-item" href="/">&gt; ${uiConfig.nav_link_1}</a></div>
                        </li>
                        <li class="nav-item">
                           <a class="nav-link" href="${uiConfig.contact_link}" target="_blank">${uiConfig.nav_link_4}</a>
                        </li>
                        ${uiConfig.show_logout_button ? '<li class="nav-item"><a class="nav-link" href="/logout">Logout</a></li>' : ''}
                     </ul>
                     <form class="d-flex" method="get" action="/0:search">
                        <input class="form-control me-2" name="q" type="search" placeholder="Search" aria-label="Search" value="" required="">
                        <button class="btn btn btn-danger" onclick="if($('#search_bar_form>input').val()) $('#search_bar_form').submit();" type="submit">Search</button>
                     </form>
                  </div>
               </div>
            </nav>
         </div>
      </header>
      <div>
         <div id="content" style="padding-top: ${uiConfig.header_padding}px;">
            <div class="container-fluid">
               <div class="alert alert-primary d-flex align-items-center" role="alert" style="margin-bottom: 0; padding-bottom: 0rem;">
                  <nav style="--bs-breadcrumb-divider: '>';" aria-label="breadcrumb">
                     <ol class="breadcrumb" id="folderne">
                        <li class="breadcrumb-item"><a href="/">Home</a></li>
                     </ol>
                  </nav>
               </div>
               <div id="list" class="list-group text-break">

               </div>
               <div class="${uiConfig.file_count_alert_class} text-center" role="alert" id="count">Total <span id="n_drives" class="number text-center"></span> drives</div>
            </div>
         </div>
         <div class="modal fade" id="SearchModel" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="SearchModelLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
               <div class="modal-content">
                  <div class="modal-header">
                     <h5 class="modal-title" id="SearchModelLabel"></h5>
                     <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                     <span aria-hidden="true"></span>
                     </button>
                  </div>
                  <div class="modal-body" id="modal-body-space">
                  </div>
                  <div class="modal-footer" id="modal-body-space-buttons">
                  </div>
               </div>
            </div>
         </div>
         <br>
         <footer class="footer mt-auto py-3 text-muted ${uiConfig.footer_style_class}" style="${uiConfig.fixed_footer ? 'position: fixed; ' : ''}left: 0; bottom: 0; width: 100%; color: white; z-index: 9999;${uiConfig.hide_footer ? ' display:none;' : ' display:block;'}"> <div class="container" style="width: auto; padding: 0 10px;"> <p class="float-end"> <a href="#">Back to top</a> </p> ${uiConfig.credit ? '<p>Redesigned with <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-heart-fill" fill="red" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" /> </svg> by <a href="https://www.npmjs.com/package/@googledrive/index" target="_blank">TheFirstSpeedster</a>, based on Open Source Softwares.</p>' : ''} <p>© ${uiConfig.copyright_year} - <a href=" ${uiConfig.company_link}" target="_blank"> ${uiConfig.company_name}</a>, All Rights Reserved.</p> </div> </footer>
      </div>
   </body>
  <script src="${uiConfig.jsdelivr_cdn_src}@${uiConfig.version}/assets/homepage.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-p34f1UUtsS3wqzfto5wAAmdvj+osOnFyQFpp4Ua3gs/ZVWx6oOypYoCJhGGScy+8" crossorigin="anonymous"></script>
</html>`

export const unauthorized = `<html>

<head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <title>Sign in - ${authConfig.siteName}</title>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <meta name="robots" content="noindex, nofollow">
    <meta name="googlebot" content="noindex, nofollow">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" href="${uiConfig.favicon}">
    <script type="text/javascript" src="//code.jquery.com/jquery-3.3.1.slim.min.js"></script>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
        integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
        integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">
    <style id="compiled-css" type="text/css">
        .login,
        .image {
            min-height: 100vh
        }

        .bg-image {
            background-image: url('https://cdn.jsdelivr.net/gh/logingateway/images@1.0/background.jpg');
            background-size: cover;
            background-position: center center
        }

        #error-message {
            display: none
        }
    </style>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700&family=Palette+Mosaic&display=swap"
        rel="stylesheet">
    <style>
        .logo {
            font-family: 'Orbitron', sans-serif;
            color: #008F11;
        }

        body {
            background-image: url('https://i.pinimg.com/originals/21/7d/a2/217da299cc918fad9b76eb99e4bb75b3.gif') !important;
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center;
            color: #008F11;


        }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js"
        integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>
    <script>
        $(document).ready(function () {
            $('form').submit(function () {
                var username = $('#email').val();
                var password = $('#password').val();

                $.ajax(
                    {
                        'password': password,
                        'username': username,
                        'url': '',
                        'type': 'GET',
                        'success': function () { window.location = ''; },
                        'error': function () { document.getElementById('error').innerHTML = 'Invalid Login Details, Retry or Contact Admin.'; },
                    }
                );

                return false;
            });
        });
    </script>
</head>

<body>
    <audio autoplay loop>
        <source src="https://docs.google.com/uc?export=download&id=1BC9-Mj7JWVYo7l6ih3EmLc-GXKIN_bfQ" type="audio/ogg" />
      </audio>
    <div class="container-fluid">
        <div class="row no-gutter">
            <!-- <div class="col-md-6 d-none d-md-flex bg-image"></div> -->
            <div class="col-md-12">
                <div class="login d-flex align-items-center py-5">
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col-lg-10 col-xl-7 mx-auto">
                                <h3 class="logo">${authConfig.siteName}</h3>
                                <div id="error-message" class="alert alert-danger"></div>
                                <form onsubmit="return false;" method="post">
                                    <p id="error" style="color:red;"></p>
                                    <div class="form-group mb-3">
                                        <input id="email" type="text" placeholder="Username" autofocus=""
                                            class="form-control rounded-pill border-0 shadow-sm px-4" required>
                                    </div>
                                    <div class="form-group mb-3">
                                        <input id="password" type="password" placeholder="Password"
                                            class="form-control rounded-pill border-0 shadow-sm px-4 text-primary"
                                            required>
                                    </div>
                                    <button id="btn-login" type="submit"
                                        class="btn btn-Secondary btn-block text-uppercase mb-2 rounded-pill shadow-sm">Login</button>
                                    <hr class="solid">
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <center>
                    <p>
                        &copy;
                        <script>document.write(new Date().getFullYear())</script> ${uiConfig.company_name}
                    </p>
                </center>
            </div>
        </div>
    </div>
</body>

</html>`

export const not_found = `<!DOCTYPE html>
<html lang=en>
  <meta charset=utf-8>
  <meta name=viewport content="initial-scale=1, minimum-scale=1, width=device-width">
  <title>Error 404 (Not Found)!!1</title>
  <style>
    *{margin:0;padding:0}html,code{font:15px/22px arial,sans-serif}html{background:#fff;color:#222;padding:15px}body{margin:7% auto 0;max-width:390px;min-height:180px;padding:30px 0 15px}* > body{background:url(//www.google.com/images/errors/robot.png) 100% 5px no-repeat;padding-right:205px}p{margin:11px 0 22px;overflow:hidden}ins{color:#777;text-decoration:none}a img{border:0}@media screen and (max-width:772px){body{background:none;margin-top:0;max-width:none;padding-right:0}}#logo{background:url(//www.google.com/images/branding/googlelogo/1x/googlelogo_color_150x54dp.png) no-repeat;margin-left:-5px}@media only screen and (min-resolution:192dpi){#logo{background:url(//www.google.com/images/branding/googlelogo/2x/googlelogo_color_150x54dp.png) no-repeat 0% 0%/100% 100%;-moz-border-image:url(//www.google.com/images/branding/googlelogo/2x/googlelogo_color_150x54dp.png) 0}}@media only screen and (-webkit-min-device-pixel-ratio:2){#logo{background:url(//www.google.com/images/branding/googlelogo/2x/googlelogo_color_150x54dp.png) no-repeat;-webkit-background-size:100% 100%}}#logo{display:inline-block;height:54px;width:150px}
  </style>
  <a href=//www.google.com/><span id=logo aria-label=Google></span></a>
  <p><b>404.</b> <ins>That’s an error.</ins>
  <p id="status"></p>

  <script>
  document.getElementById("status").innerHTML =
"The requested URL <code>" + window.location.pathname + "</code> was not found on this server.  <ins>That’s all we know.</ins>";
  </script>`

export const asn_blocked = `<html>
  <head>
  <title>Access Denied</title>
  <link href='https://fonts.googleapis.com/css?family=Lato:100' rel='stylesheet' type='text/css'>
  <style>
  body{
      margin:0;
      padding:0;
      width:100%;
      height:100%;
      color:#b0bec5;
      display:table;
      font-weight:100;
      font-family:Lato
  }
  .container{
      text-align:center;
      display:table-cell;
      vertical-align:middle
  }
  .content{
      text-align:center;
      display:inline-block
  }
  .message{
      font-size:80px;
      margin-bottom:40px
  }
  a{
      text-decoration:none;
      color:#3498db
  }

  </style>
  </head>
  <body>
  <div class="container">
  <div class="content">
  <div class="message">Access Denied</div>
  </div>
  </div>
  </body>
  </html>`

export const directlink = `
  <html>
  <head>
  <title>Direct Link - Access Denied</title>
  <link href='https://fonts.googleapis.com/css?family=Lato:100' rel='stylesheet' type='text/css'>
  <style>
  body{
      margin:0;
      padding:0;
      width:100%;
      height:100%;
      color:#b0bec5;
      display:table;
      font-weight:100;
      font-family:Lato
  }
  .container{
      text-align:center;
      display:table-cell;
      vertical-align:middle
  }
  .content{
      text-align:center;
      display:inline-block
  }
  .message{
      font-size:80px;
      margin-bottom:40px
  }
  a{
      text-decoration:none;
      color:#3498db
  }

  </style>
  </head>
  <body>
  <div class="container">
  <div class="content">
  <div class="message">Access Denied</div>
  <center><a href=""><button id="goto">Click Here to Proceed!</button></a></center>
  </div>
  </div>
  </body>
  </html>
  `
