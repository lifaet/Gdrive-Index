/* ============================================================
   CONFIG
   ------------------------------------------------------------
   Edit this file to change which Drive folders are indexed,
   site branding/theme, and feature toggles. Nothing else in
   this project should need editing for day-to-day changes.
   ============================================================ */
//first
export const serviceaccounts = [
    {}
];
const randomserviceaccount = serviceaccounts[Math.floor(Math.random() * serviceaccounts.length)]; // DO NOT TOUCH THIS
const domains_for_dl = ['']; // add multiple cloudflare addresses to balance the load on download/stream servers, eg. ['https://testing.fetchgoogleapi.workers.dev', 'https://testing2.fetchgoogleapi2.workers.dev']
const domain_for_dl = domains_for_dl[Math.floor(Math.random() * domains_for_dl.length)]; // DO NOT TOUCH THIS
const video_domains_for_dl = ['']; // add multiple cloudflare addresses to balance the load on download/stream servers, eg. ['https://testing.fetchgoogleapi.workers.dev', 'https://testing2.fetchgoogleapi2.workers.dev']
const video_domain_for_dl = video_domains_for_dl[Math.floor(Math.random() * video_domains_for_dl.length)]; // DO NOT TOUCH THIS
export const blocked_region = ['']; // add regional codes seperated by comma, eg. ['IN', 'US', 'PK']
export const blocked_asn = []; // add ASN numbers from http://www.bgplookingglass.com/list-of-autonomous-system-numbers, eg. [16509, 12345]
const authConfig = {
    "siteName": "ZIM", // Website name
    "client_id": CLIENT_ID,
    "client_secret": CLIENT_SECRET,
    "refresh_token": REFRESH_TOKEN,
    "service_account": false, // true if you're using Service Account instead of user account
    "service_account_json": randomserviceaccount, // don't touch this one
    "files_list_page_size": 50,
    "search_result_list_page_size": 50,
    "enable_cors_file_down": false,
    "enable_password_file_verify": true, // support for .password file
    "direct_link_protection": false, // protects direct links with Display UI
    "lock_folders": false, // keeps folders and search locked if auth in on, and allows individual file view
    "enable_auth0_com": false, // follow guide to add auth0.com to secure index with powerful login based system
    "roots": [
        {
            "id": "1Hm1WM2qVgTXArfA5Lbgaf8HIjEEOD_89",
            "name": "Personal Documents",
            "protect_file_link": false,
            "auth": { "Zim": "Z1m01834@", "superadmin": "sUp3r@dM1n" } /* Remove double slash before "auth" to activate id password protection */
        }, {
            "id": "1iKxeBPAh_2gvs9MJd830RvRPbwCSrtLc",
            "name": "Books & Sheets 🔓",
            "protect_file_link": false,
        }, {
            "id": "0AOWC3BqPtKeTUk9PVA",
            "name": "Temp Directory",
            "protect_file_link": false,
            "auth": { "moviesbayx": "moviesbayx", "superadmin": "sUp3r@dM1n" } /* Remove double slash before "auth" to activate id password protection */
        }, {
            "id": "13rXLVBGyMUKqsNnjfbNhaQfYet39FF1P",
            "name": "Quick Share 🔓",
            "protect_file_link": false
            //"auth": { "moviesbayx": "moviesbayx" } /* Remove double slash before "auth" to activate id password protection */
        }, {
            "id": "17sHPHmFEz9ZhZh1kCgkuf5AQgeqRcXeF",
            "name": "DB",
            "protect_file_link": false,
            "auth": { "Zim": "Z1m01834@@", "superadmin": "sUp3r@dM1n" } /* Remove double slash before "auth" to activate id password protection */
        }, {
            "id": "1nW5QXMZIz1zv4t_5c2hNnge3K_Op7AVz",
            "name": "AZAD",
            "protect_file_link": false,
            // "auth": { "Zim": "Z1m01834@@", "superadmin": "sUp3r@dM1n" } /* Remove double slash before "auth" to activate id password protection */
        }
    ]
};

export const auth0 = {
    domain: "", // Tenent Domain from auth0.com website
    clientId: "", // App Client ID from auth0.com website
    clientSecret: "", // App Client Secret from auth0.com website
    callbackUrl: "", // your domain with /auth at the end. eg. https://example.com/auth, add this in auth0.com too
    logoutUrl: "", // your domain logout page eg. https://example.com, add this in auth0.com too
}

export const uiConfig = {
    "theme": "darkly", // switch between themes, default set to slate, select from https://gitlab.com/ParveenBhadooOfficial/Google-Drive-Index
    "version": "2.1.8", // don't touch this one. get latest code using generator at https://bdi-generator.hashhackers.com
    // If you're using Image then set to true, If you want text then set it to false
    "logo_image": true, // true if you're using image link in next option.
    "logo_height": "15px", // only if logo_image is true
    "logo_width": "25px", // only if logo_image is true
    "favicon": "https://lifaet.github.io/images/favicon.ico",
    // if logo is true then link otherwise just text for name
    "logo_link_name": "https://lifaet.github.io/assets/images/favicon.ico",
    "fixed_header": false, // If you want the footer to be flexible or fixed.
    "header_padding": "20", // Value 80 for fixed header, Value 20 for flexible header. Required to be changed accordingly in some themes.
    "nav_link_1": "Home", // change navigation link name
    "nav_link_3": "Current Path", // change navigation link name
    "nav_link_4": "Contact", // change navigation link name
    "show_logout_button": false, // shows logout button if auth0.com is active
    "fixed_footer": false, // If you want the footer to be flexible or fixed.
    "hide_footer": false, // hides the footer from site entirely.
    "header_style_class": "navbar-dark bg-dark", // navbar-dark bg-primary || navbar-dark bg-dark || navbar-light bg-light
    "footer_style_class": "white", // bg-primary || bg-dark || bg-light
    "css_a_tag_color": "white", // Color Name or Hex Code eg. #ffffff
    "css_p_tag_color": "white", // Color Name or Hex Code eg. #ffffff
    "folder_text_color": "white", // Color Name or Hex Code eg. #ffffff
    "loading_spinner_class": "text-light", // https://getbootstrap.com/docs/5.0/components/spinners/#colors
    "search_button_class": "btn btn-secondary", // https://getbootstrap.com/docs/5.0/components/buttons/#examples
    "path_nav_alert_class": "alert alert-primary", // https://getbootstrap.com/docs/4.0/components/alerts/#examples
    "file_view_alert_class": "alert alert-danger", // https://getbootstrap.com/docs/4.0/components/alerts/#examples
    "file_count_alert_class": "alert alert-secondary", // https://getbootstrap.com/docs/4.0/components/alerts/#examples
    "contact_link": "https://t.me/lifaet", // Link to Contact Button on Menu
    "copyright_year": "2025", // year of copyright, can be anything like 2015 - 2020 or just 2020
    "company_name": "ZIM", // Name next to copyright
    "company_link": "https://lifaet.github.io/", // link of copyright name
    "credit": false, // Set this to true to give us credit
    "display_size": true, // Set this to false to hide display file size
    "display_time": false, // Set this to false to hide display modified time for folder and files
    "display_download": true, // Set this to false to hide download icon for folder and files on main index
    "disable_player": false, // Set this to true to hide audio and video players
    "custom_srt_lang": "", // Subtitle Language Code for Custom .vtt language.
    "disable_video_download": false, // Remove Download, Copy Button on Videos
    "second_domain_for_dl": false, // If you want to display other URL for Downloading to protect your main domain.
    "downloaddomain": domain_for_dl, // Ignore this and set domains at top of this page after service accounts.
    "videodomain": video_domain_for_dl, // Ignore this and set domains at top of this page after service accounts.
    "poster": "https://cdn.jsdelivr.net/npm/@googledrive/index@2.1.8/images/poster.jpg", // Video poster URL or see Readme to how to load from Drive
    "audioposter": "https://cdn.jsdelivr.net/npm/@googledrive/index@2.1.8/images/music.jpg", // Video poster URL or see Readme to how to load from Drive
    "jsdelivr_cdn_src": "https://cdn.jsdelivr.net/npm/@googledrive/index", // If Project is Forked, then enter your GitHub repo
    "render_head_md": true, // Render Head.md
    "render_readme_md": true, // Render Readme.md
    "display_drive_link": true, // This will add a Link Button to Google Drive of that particular file.
    "plyr_io_version": "3.8.3", // Change plyr.io version in future when needed.
    "plyr_io_video_resolution": "16:9", // For reference, visit: https://github.com/sampotts/plyr#options
    "unauthorized_owner_link": "https://t.me/lifaet", // Unauthorized Error Page Link to Owner
    "unauthorized_owner_email": "lifaethossain@gmail.com", // Unauthorized Error Page Owner Email
    "arc_code": "jfoY2h19", // arc.io Integration Code, get yours from https://portal.arc.io
    "search_all_drives": true // gives gdrive links on search and searches all drives on that account, doesn't require adding
};
