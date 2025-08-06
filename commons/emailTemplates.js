const dayjs = require("dayjs");
const { formatPrice, upsServiceCodes } = require("../utils/helpers");
const sanitizeHtml = require('sanitize-html');
const he = require('he');

const addTrackingNumberEmailTemplate = (trackingNumber) => {
  return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en" style="padding:0;Margin:0">
 <head>
  <meta charset="UTF-8">
  <meta content="width=device-width, initial-scale=1" name="viewport">
  <meta name="x-apple-disable-message-reformatting">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta content="telephone=no" name="format-detection">
  <!--[if (mso 16)]>
    <style type="text/css">
    a {text-decoration: none;}
    </style>
    <![endif]--><!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--><!--[if !mso]><!-- -->
  <link href="https://fonts.googleapis.com/css?family=Oswald:300,700&display=swap" rel="stylesheet"><!--<![endif]--><!--[if gte mso 9]>
<xml>
    <o:OfficeDocumentSettings>
    <o:AllowPNG></o:AllowPNG>
    <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
</xml>
<![endif]--><!--[if !mso]><!-- -->
  <link href="https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i" rel="stylesheet"><!--<![endif]-->
  <style type="text/css">
#outlook a {
	padding:0;
}
.ExternalClass {
	width:100%;
}
.ExternalClass,
.ExternalClass p,
.ExternalClass span,
.ExternalClass font,
.ExternalClass td,
.ExternalClass div {
	line-height:100%;
}
.es-button {
	mso-style-priority:100!important;
	text-decoration:none!important;
}
a[x-apple-data-detectors] {
	color:inherit!important;
	text-decoration:none!important;
	font-size:inherit!important;
	font-family:inherit!important;
	font-weight:inherit!important;
	line-height:inherit!important;
}
.es-desk-hidden {
	display:none;
	float:left;
	overflow:hidden;
	width:0;
	max-height:0;
	line-height:0;
	mso-hide:all;
}
@media only screen and (max-width:600px) {p, ul li, ol li, a { line-height:150%!important } h1, h2, h3, h1 a, h2 a, h3 a { line-height:120% } h1 { font-size:28px!important; text-align:left } h2 { font-size:20px!important; text-align:left } h3 { font-size:14px!important; text-align:left } h1 a { text-align:left } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:28px!important } h2 a { text-align:left } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:20px!important } h3 a { text-align:left } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:14px!important } .es-menu td a { font-size:14px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:14px!important } .es-content-body p, .es-content-body ul li, .es-content-body ol li, .es-content-body a { font-size:14px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:14px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:14px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:block!important } a.es-button, button.es-button { font-size:14px!important; display:block!important; border-bottom-width:20px!important; border-right-width:0px!important; border-left-width:0px!important; border-top-width:20px!important } .es-btn-fw { border-width:10px 0px!important; text-align:center!important } .es-adaptive table, .es-btn-fw, .es-btn-fw-brdr, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0px!important } .es-m-p0r { padding-right:0px!important } .es-m-p0l { padding-left:0px!important } .es-m-p0t { padding-top:0px!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } .es-desk-hidden { display:table-row!important; width:auto!important; overflow:visible!important; max-height:inherit!important } }
@media screen and (max-width:384px) {.mail-message-content { width:414px!important } }
</style>
 </head>
 <body style="width:100%;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
  <div dir="ltr" class="es-wrapper-color" lang="en" style="background-color:#F4F2F2"><!--[if gte mso 9]>
			<v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
				<v:fill type="tile" color="#f4f2f2" origin="0.5, 0" position="0.5, 0"></v:fill>
			</v:background>
		<![endif]-->
   <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#F4F2F2">
     <tr style="border-collapse:collapse">
      <td valign="top" style="padding:0;Margin:0">
       <table cellpadding="0" cellspacing="0" class="es-header" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:#1B2A2F;background-repeat:repeat;background-position:center top">
         <tr style="border-collapse:collapse">
          <td align="center" bgcolor="#111517" style="padding:0;Margin:0;background-color:#111517">
           <table class="es-header-body" cellspacing="0" cellpadding="0" bgcolor="#111517" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#111517;width:600px" role="none">
             <tr style="border-collapse:collapse">
              <td align="left" style="padding:0;Margin:0;padding-top:25px;padding-bottom:40px">
               <table cellspacing="0" cellpadding="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                 <tr style="border-collapse:collapse">
                  <td class="es-m-p0r" valign="top" align="center" style="padding:0;Margin:0;width:600px">
                   <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                     <tr style="border-collapse:collapse">
                      <td align="center" style="padding:0;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;line-height:24px;color:#FCFEFD;font-size:16px">Your one-stop shop for all your printing needs</p></td>
                     </tr>
                     <tr style="border-collapse:collapse">
                      <td align="center" class="es-m-txt-c" style="padding:0;Margin:0;font-size:0px"><a target="_blank" href="https://designprintnyc.com/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#EF0D33;font-size:16px"><img src="https://ehfakgf.stripocdn.email/content/guids/CABINET_e3dae694c00edbfc06ed9413cf7d63bf49202f8faad0a838d9a5196419c85338/images/logo.png" alt="Design Print NYC Logo" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" height="172" title="Design Print NYC Logo" width="365"></a></td>
                     </tr>
                   </table></td>
                 </tr>
               </table></td>
             </tr>
           </table></td>
         </tr>
       </table>
       <table cellpadding="0" cellspacing="0" class="es-content" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
         <tr style="border-collapse:collapse">
          <td align="center" style="padding:0;Margin:0">
           <table bgcolor="#ffffff" class="es-content-body" align="center" cellpadding="0" cellspacing="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#F5F5F5;width:600px">
             <tr style="border-collapse:collapse">
              <td align="left" style="Margin:0;padding-left:10px;padding-right:10px;padding-top:40px;padding-bottom:40px">
               <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                 <tr style="border-collapse:collapse">
                  <td align="center" valign="top" style="padding:0;Margin:0;width:580px">
                   <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                     <tr style="border-collapse:collapse">
                      <td align="center" class="es-m-txt-c" style="padding:0;Margin:0;padding-bottom:40px"><h1 style="Margin:0;line-height:34px;mso-line-height-rule:exactly;font-family:Oswald, sans-serif;font-size:28px;font-style:normal;font-weight:bold;color:#262626">Dear Customer,</h1></td>
                     </tr>
                     <tr style="border-collapse:collapse">
                      <td align="left" style="padding:0;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;line-height:30px;color:#262626;font-size:20px">We are delighted to inform you that your order has been successfully confirmed! Your items are now being prepared for shipment.</p></td>
                     </tr>
                     <tr style="border-collapse:collapse">
                      <td align="center" class="es-m-txt-c" style="padding:0;Margin:0;padding-top:40px;padding-bottom:40px"><!--[if mso]><a target="_blank" hidden>
	<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" esdevVmlButton href="https://designprintnyc.com/" 
                style="height:66px; v-text-anchor:middle; width:233px" arcsize="8%" stroke="f"  fillcolor="#ef0d33">
		<w:anchorlock></w:anchorlock>
		<center style='color:#ffffff; font-family:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"; font-size:14px; font-weight:700; line-height:14px;  mso-text-raise:1px'>Track Order</center>
	</v:roundrect></a>
<![endif]--><!--[if !mso]><!-- --><span class="msohide es-button-border" style="border-style:solid;border-color:#1B2A2F;background:#ef0d33;border-width:0px;display:inline-block;border-radius:5px;width:auto;mso-hide:all"><a href="https://designprintnyc.com/" class="es-button" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#FFFFFF;font-size:14px;display:inline-block;background:#ef0d33;border-radius:5px;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';font-weight:bold;font-style:normal;line-height:17px;width:auto;text-align:center;padding:25px 40px 25px 40px;mso-padding-alt:0;mso-border-alt:10px solid  #ef0d33">Track Order</a></span><!--<![endif]--></td>
                     </tr>
                     <tr style="border-collapse:collapse">
                      <td align="left" style="padding:0;Margin:0;padding-bottom:20px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;line-height:30px;color:#262626;font-size:20px">To track your order, please use the below tracking number. You can track the status of your delivery by visiting our website and entering your tracking number in the designated tracking section.</p></td>
                     </tr>
                     <tr style="border-collapse:collapse">
                      <td align="center" style="padding:0;Margin:0;padding-bottom:20px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;line-height:30px;color:#262626;font-size:20px"><strong><a target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;color:#EF0D33;font-size:20px" href="https://designprintnyc.com/">${trackingNumber}</a></strong></p></td>
                     </tr>
                     <tr style="border-collapse:collapse">
                      <td align="left" style="padding:0;Margin:0;padding-bottom:40px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;line-height:30px;color:#262626;font-size:20px">If you have any questions, just reply to this email—we're always happy to help out.</p></td>
                     </tr>
                     <tr style="border-collapse:collapse">
                      <td align="left" style="padding:0;Margin:0;padding-bottom:20px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;line-height:30px;color:#262626;font-size:20px"><strong>Cheers, The Design Print NYC&nbsp;</strong></p></td>
                     </tr>
                   </table></td>
                 </tr>
               </table></td>
             </tr>
           </table></td>
         </tr>
       </table>
       <table cellpadding="0" cellspacing="0" class="es-footer" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:#111517;background-repeat:repeat;background-position:center top">
         <tr style="border-collapse:collapse">
          <td align="center" style="padding:0;Margin:0">
           <table class="es-footer-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#111517;width:600px">
             <tr style="border-collapse:collapse">
              <td align="left" style="Margin:0;padding-left:20px;padding-right:20px;padding-top:40px;padding-bottom:40px"><!--[if mso]><table style="width:560px" cellpadding="0" 
                        cellspacing="0"><tr><td style="width:175px" valign="top"><![endif]-->
               <table class="es-left" cellspacing="0" cellpadding="0" align="left" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                 <tr style="border-collapse:collapse">
                  <td class="es-m-p20b" align="left" style="padding:0;Margin:0;width:175px">
                   <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                     <tr style="border-collapse:collapse">
                      <td align="center" class="es-m-txt-c" style="padding:0;Margin:0;font-size:0px"><a target="_blank" href="https://designprintnyc.com/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#EF0D33;font-size:14px"><img src="https://ehfakgf.stripocdn.email/content/guids/CABINET_e3dae694c00edbfc06ed9413cf7d63bf49202f8faad0a838d9a5196419c85338/images/logo.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="150" height="71"></a></td>
                     </tr>
                     <tr style="border-collapse:collapse">
                      <td align="center" class="es-m-txt-c" style="padding:0;Margin:0;padding-top:20px;font-size:0">
                       <table cellpadding="0" cellspacing="0" class="es-table-not-adapt es-social" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                         <tr style="border-collapse:collapse">
                          <td align="center" valign="top" style="padding:0;Margin:0;padding-right:10px"><a target="_blank" href="https://www.facebook.com/designprintnyc?mibextid=9R9pXO" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#EF0D33;font-size:14px"><img src="https://ehfakgf.stripocdn.email/content/assets/img/social-icons/logo-white/facebook-logo-white.png" alt="Fb" title="Facebook" width="32" height="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></a></td>
                          <td align="center" valign="top" style="padding:0;Margin:0;padding-right:10px"><img target="_blank" href="https://www.youtube.com/@designprintnyc?si=yfOnk16z_rRXpQnC" src="https://ehfakgf.stripocdn.email/content/assets/img/social-icons/logo-white/youtube-logo-white.png" alt="Yt" title="Youtube" width="32" height="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></td>
                          <td align="center" valign="top" style="padding:0;Margin:0"><img target="_blank" href="https://www.instagram.com/designprintnyc/" src="https://ehfakgf.stripocdn.email/content/assets/img/social-icons/logo-white/instagram-logo-white.png" alt="Ig" title="Instagram" width="32" height="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></td>
                         </tr>
                       </table></td>
                     </tr>
                   </table></td>
                 </tr>
               </table><!--[if mso]></td><td style="width:20px"></td><td style="width:365px" valign="top"><![endif]-->
               <table class="es-right" cellspacing="0" cellpadding="0" align="right" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                 <tr style="border-collapse:collapse">
                  <td align="left" style="padding:0;Margin:0;width:365px">
                   <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                     <tr style="border-collapse:collapse">
                      <td align="left" class="es-m-txt-c" style="padding:0;Margin:0;padding-left:15px;padding-top:20px;padding-bottom:20px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;line-height:21px;color:#FFFFFF;font-size:14px">Welcome to DesignPrintNYC, your one-stop shop for all your printing needs! Whether you're looking for business cards, banners, or brochures, we've covered you with top-quality printing services.</p></td>
                     </tr>
                   </table></td>
                 </tr>
               </table><!--[if mso]></td></tr></table><![endif]--></td>
             </tr>
           </table></td>
         </tr>
       </table></td>
     </tr>
   </table>
  </div>
 </body>
</html>
    `;
};

// const newsLetterSubscribedEmailTemplate = () => {
//   return `
//     <!DOCTYPE html>
//       <html>
  
//       <head>
  
//           <meta charset="utf-8">
//           <meta http-equiv="x-ua-compatible" content="ie=edge">
//           <title>Email Confirmation</title>
//           <meta name="viewport" content="width=device-width, initial-scale=1">
//           <style type="text/css">
//               /**
//          * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
//          */
//               @media screen {
//                   @font-face {
//                       font-family: 'Source Sans Pro';
//                       font-style: normal;
//                       font-weight: 400;
//                       src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
//                   }
  
//                   @font-face {
//                       font-family: 'Source Sans Pro';
//                       font-style: normal;
//                       font-weight: 700;
//                       src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
//                   }
//               }
  
//               /**
//          * Avoid browser level font resizing.
//          * 1. Windows Mobile
//          * 2. iOS / OSX
//          */
//               body,
//               table,
//               td,
//               a {
//                   -ms-text-size-adjust: 100%;
//                   /* 1 */
//                   -webkit-text-size-adjust: 100%;
//                   /* 2 */
//               }
  
//               /**
//          * Remove extra space added to tables and cells in Outlook.
//          */
//               table,
//               td {
//                   mso-table-rspace: 0pt;
//                   mso-table-lspace: 0pt;
//               }
  
//               /**
//          * Better fluid images in Internet Explorer.
//          */
//               img {
//                   -ms-interpolation-mode: bicubic;
//               }
  
//               /**
//          * Remove blue links for iOS devices.
//          */
//               a[x-apple-data-detectors] {
//                   font-family: inherit !important;
//                   font-size: inherit !important;
//                   font-weight: inherit !important;
//                   line-height: inherit !important;
//                   color: inherit !important;
//                   text-decoration: none !important;
//               }
  
//               /**
//          * Fix centering issues in Android 4.4.
//          */
//               div[style*="margin: 16px 0;"] {
//                   margin: 0 !important;
//               }
  
//               body {
//                   width: 100% !important;
//                   height: 100% !important;
//                   padding: 0 !important;
//                   margin: 0 !important;
//               }
  
//               /**
//          * Collapse table borders to avoid space between cells.
//          */
//               table {
//                   border-collapse: collapse !important;
//               }
  
//               a {
//                   color: #1a82e2;
//               }
  
//               img {
//                   height: auto;
//                   line-height: 100%;
//                   text-decoration: none;
//                   border: 0;
//                   outline: none;
//               }
//           </style>
  
//       </head>
  
//       <body style="background-color: #e9ecef;">
  
  
//           <!-- start body -->
//           <table border="0" cellpadding="0" cellspacing="0" width="100%">
  
//               <!-- start logo -->
//               <tr>
//                   <td align="center" bgcolor="#e9ecef">
//                       <!--[if (gte mso 9)|(IE)]>
//               <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
//               <tr>
//               <td align="center" valign="top" width="600">
//               <![endif]-->
//                       <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
//                           <tr>
//                               <td align="center" valign="top" style="padding: 36px 24px;">
//                                   <a href="${process.env.CLIENT_URL}" target="_blank" style="display: inline-block;">
//                                       <img src="https://ehfakgf.stripocdn.email/content/guids/CABINET_e3dae694c00edbfc06ed9413cf7d63bf49202f8faad0a838d9a5196419c85338/images/logo.png"
//                                           alt="Logo" border="0" style="display: block; width: 200px;">
//                                   </a>
//                               </td>
//                           </tr>
//                       </table>
//                       <!--[if (gte mso 9)|(IE)]>
//               </td>
//               </tr>
//               </table>
//               <![endif]-->
//                   </td>
//               </tr>
//               <!-- end logo -->
  
//               <!-- start hero -->
//               <tr>
//                   <td align="center" bgcolor="#e9ecef">
//                       <!--[if (gte mso 9)|(IE)]>
//               <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
//               <tr>
//               <td align="center" valign="top" width="600">
//               <![endif]-->
//                       <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
//                           <tr>
//                               <td align="left" bgcolor="#ffffff"
//                                   style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
//                                   <h1
//                                       style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">
//                                       Thank you for subscribing Designprint NYC Newsletter</h1>
//                               </td>
//                           </tr>
//                       </table>
//                       <!--[if (gte mso 9)|(IE)]>
//               </td>
//               </tr>
//               </table>
//               <![endif]-->
//                   </td>
//               </tr>
//               <!-- end hero -->
  
//               <!-- start copy block -->
//               <tr>
//                   <td align="center" bgcolor="#e9ecef">
//                       <!--[if (gte mso 9)|(IE)]>
//               <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
//               <tr>
//               <td align="center" valign="top" width="600">
//               <![endif]-->
//                       <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
  
            
  
//                           <!-- start copy -->
//                           <tr>
//                               <td align="left" bgcolor="#ffffff"
//                                   style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
//                                   <p style="margin: 0;">You have been awarded with 20% off on every order on <a href="https://prod.designprintnyc.com">www.designprintnyc.com</a>. Please use the following voucher code on checkout.</p>
//                                     <p style="font-size:32px; text-align:center">VMOC0720</p>  
//                                   <p style="margin: 0;">In case of any query, please contact us at (631) 572-5131 or email us at info@designprintnyc.com .</p>
//                             <p style="margin: 0; font-weight:bold">To radeem this voucher via phone order, give us a call.</p>
//                                   </td>
//                           </tr>
//                           <!-- end copy -->
  
//                           <!-- start copy -->
//                           <tr>
//                               <td align="left" bgcolor="#ffffff"
//                                   style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">
//                                   <p style="margin: 0;">Thank you, <br />
//                                       The DesignPrintNYC Team</p>
//                               </td>
//                           </tr>
//                           <!-- end copy -->
  
//                       </table>
//                       <!--[if (gte mso 9)|(IE)]>
//               </td>
//               </tr>
//               </table>
//               <![endif]-->
//                   </td>
//               </tr>
//               <!-- end copy block -->
  
//               <!-- start footer -->
//               <tr>
//                   <td align="center" bgcolor="#e9ecef" style="padding: 24px;">
//                       <!--[if (gte mso 9)|(IE)]>
//               <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
//               <tr>
//               <td align="center" valign="top" width="600">
//               <![endif]-->
//                       <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
  
//                           <!-- start permission -->
//                           <tr>
//                               <td align="center" bgcolor="#e9ecef"
//                                   style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
//                                   <p style="margin: 0;">
//                                   </p>
//                               </td>
//                           </tr>
//                       </table>
//                       <!--[if (gte mso 9)|(IE)]>
//               </td>
//               </tr>
//               </table>
//               <![endif]-->
//                   </td>
//               </tr>
//               <!-- end footer -->
  
//           </table>
//           <!-- end body -->
  
//       </body>
  
//     </html>`;
// };

const newsLetterSubscribedEmailTemplate = ( email, settings ) => { 
  const companyWebsite = settings.storeURL; 
    const subscriberEmail = email || 'your-email@example.com'; 
    const apiUrl = settings.apiUrl;
    const completeLogoUrl = apiUrl + settings.logo;
    const storeName = settings.storeName;
    const storeColor = settings.primaryColor;
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>Newsletter Subscription</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style type="text/css">
        /* Base Styles */
        body, table, td, a { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }
        table, td { mso-table-rspace: 0pt; mso-table-lspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        table { border-collapse: collapse !important; }
        body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #f8f9fa; /* Light grey background */ }

        /* Link Styles */
        a { color:${storeColor} ; /* Green links */ text-decoration: none; }
        a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }

        /* Responsive Styles */
        @media screen and (max-width: 600px) {
            .content-table { width: 100% !important; max-width: 100% !important; }
            .content-cell { padding-left: 15px !important; padding-right: 15px !important; }
            .logo { width: 150px !important; height: auto !important; }
            h1 { font-size: 24px !important; line-height: 32px !important; }
        }
    </style>
</head>
<body style="margin: 0 !important; padding: 0 !important; background-color: #f8f9fa;">

    <!-- Preheader (Optional, Hidden) -->
    <div style="display: none; max-height: 0; overflow: hidden;">
        Thank you for subscribing to the ${storeName} newsletter!
    </div>

    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <!-- Body Wrapper -->
        <tr>
            <td align="center" valign="top" bgcolor="#f8f9fa" style="padding: 20px 0;">
                <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                <tr>
                <td align="center" valign="top" width="600">
                <![endif]-->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" class="content-table" style="max-width: 600px; background-color: #ffffff; border-radius: 4px; overflow: hidden;">

                    <!-- Logo -->
                    <tr>
                        <td align="left" valign="top" class="content-cell" style="padding: 24px 24px 16px 24px;">
                             <!-- === LOGO PLACEHOLDER === -->
                             <img src="${completeLogoUrl}" alt="Company Logo" border="0" class="logo" style="display: block; width: 180px;">
                             <!-- ======================== -->
                        </td>
                    </tr>

                    <!-- Content Area -->
                    <tr>
                        <td align="left" valign="top" class="content-cell" style="padding: 0 24px 24px 24px; font-family: Arial, sans-serif; font-size: 15px; line-height: 24px; color: #333333;">

                            <!-- Heading -->
                            <h1 style="margin: 0 0 20px 0; font-size: 28px; font-weight: bold; line-height: 36px; color:#449299;">
                                News Letter Subscribed
                            </h1>

                            <!-- Greeting -->
                            <p style="margin: 0 0 16px 0;">
                                <strong style="color: #000000;">Dear Customer,</strong>
                            </p>

                            <!-- Confirmation Text -->
                            <p style="margin: 0 0 24px 0;">
                                You have been subscribed to <a href="${companyWebsite}" target="_blank" style="color:#449299; text-decoration: none;">${companyWebsite}</a> successfully with email address <span style="color:#449299; text-decoration: none;">${subscriberEmail}</span>.
                            </p>

                            <!-- Regards -->
                            <p style="margin: 0 0 4px 0;">
                                Regards
                            </p>
                            <p style="margin: 0 0 24px 0;">
                                Customer Care
                            </p>

                        </td>
                    </tr>
                    <!-- End Content Area -->

                </table>
                <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
            </td>
        </tr>
        <!-- End Body Wrapper -->

         <!-- Footer Area (Minimal) -->
        <tr>
            <td align="center" valign="top" bgcolor="#f8f9fa" style="padding: 24px;">
                 <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                <tr>
                <td align="center" valign="top" width="600">
                <![endif]-->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td align="center" valign="top" style="padding: 0; font-family: Arial, sans-serif; font-size: 12px; line-height: 18px; color: #666666;">
                            <p style="margin: 0;">You are receiving this email because you opted in to our newsletter.</p>
                            <!-- Consider adding an unsubscribe link here if required by regulations -->
                            <!-- <p style="margin: 5px 0 0 0;"><a href="{UNSUBSCRIBE_URL}" target="_blank" style="color: #666666;">Unsubscribe</a></p> -->
                        </td>
                    </tr>
                </table>
                <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
            </td>
        </tr>
        <!-- End Footer -->


    </table>

</body>
</html>
`;
};

// const resetPasswordEmailTemplate = (token) => {
//   return `
//   <!DOCTYPE html>
//     <html>

//     <head>

//         <meta charset="utf-8">
//         <meta http-equiv="x-ua-compatible" content="ie=edge">
//         <title>Email Confirmation</title>
//         <meta name="viewport" content="width=device-width, initial-scale=1">
//         <style type="text/css">
//             /**
//        * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
//        */
//             @media screen {
//                 @font-face {
//                     font-family: 'Source Sans Pro';
//                     font-style: normal;
//                     font-weight: 400;
//                     src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
//                 }

//                 @font-face {
//                     font-family: 'Source Sans Pro';
//                     font-style: normal;
//                     font-weight: 700;
//                     src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
//                 }
//             }

//             /**
//        * Avoid browser level font resizing.
//        * 1. Windows Mobile
//        * 2. iOS / OSX
//        */
//             body,
//             table,
//             td,
//             a {
//                 -ms-text-size-adjust: 100%;
//                 /* 1 */
//                 -webkit-text-size-adjust: 100%;
//                 /* 2 */
//             }

//             /**
//        * Remove extra space added to tables and cells in Outlook.
//        */
//             table,
//             td {
//                 mso-table-rspace: 0pt;
//                 mso-table-lspace: 0pt;
//             }

//             /**
//        * Better fluid images in Internet Explorer.
//        */
//             img {
//                 -ms-interpolation-mode: bicubic;
//             }

//             /**
//        * Remove blue links for iOS devices.
//        */
//             a[x-apple-data-detectors] {
//                 font-family: inherit !important;
//                 font-size: inherit !important;
//                 font-weight: inherit !important;
//                 line-height: inherit !important;
//                 color: inherit !important;
//                 text-decoration: none !important;
//             }

//             /**
//        * Fix centering issues in Android 4.4.
//        */
//             div[style*="margin: 16px 0;"] {
//                 margin: 0 !important;
//             }

//             body {
//                 width: 100% !important;
//                 height: 100% !important;
//                 padding: 0 !important;
//                 margin: 0 !important;
//             }

//             /**
//        * Collapse table borders to avoid space between cells.
//        */
//             table {
//                 border-collapse: collapse !important;
//             }

//             a {
//                 color: #1a82e2;
//             }

//             img {
//                 height: auto;
//                 line-height: 100%;
//                 text-decoration: none;
//                 border: 0;
//                 outline: none;
//             }
//         </style>

//     </head>

//     <body style="background-color: #e9ecef;">

//         <!-- start preheader -->
//         <div class="preheader"
//             style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
//             A preheader is the short summary text that follows the subject line when an email is viewed in the inbox.
//         </div>
//         <!-- end preheader -->

//         <!-- start body -->
//         <table border="0" cellpadding="0" cellspacing="0" width="100%">

//             <!-- start logo -->
//             <tr>
//                 <td align="center" bgcolor="#e9ecef">
//                     <!--[if (gte mso 9)|(IE)]>
//             <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
//             <tr>
//             <td align="center" valign="top" width="600">
//             <![endif]-->
//                     <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
//                         <tr>
//                             <td align="center" valign="top" style="padding: 36px 24px;">
//                                 <a href="${process.env.CLIENT_URL}" target="_blank" style="display: inline-block;">
//                                     <img src="https://ehfakgf.stripocdn.email/content/guids/CABINET_e3dae694c00edbfc06ed9413cf7d63bf49202f8faad0a838d9a5196419c85338/images/logo.png"
//                                         alt="Logo" border="0" style="display: block; width: 200px;">
//                                 </a>
//                             </td>
//                         </tr>
//                     </table>
//                     <!--[if (gte mso 9)|(IE)]>
//             </td>
//             </tr>
//             </table>
//             <![endif]-->
//                 </td>
//             </tr>
//             <!-- end logo -->

//             <!-- start hero -->
//             <tr>
//                 <td align="center" bgcolor="#e9ecef">
//                     <!--[if (gte mso 9)|(IE)]>
//             <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
//             <tr>
//             <td align="center" valign="top" width="600">
//             <![endif]-->
//                     <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
//                         <tr>
//                             <td align="left" bgcolor="#ffffff"
//                                 style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
//                                 <h1
//                                     style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">
//                                     Reset Your Password</h1>
//                             </td>
//                         </tr>
//                     </table>
//                     <!--[if (gte mso 9)|(IE)]>
//             </td>
//             </tr>
//             </table>
//             <![endif]-->
//                 </td>
//             </tr>
//             <!-- end hero -->

//             <!-- start copy block -->
//             <tr>
//                 <td align="center" bgcolor="#e9ecef">
//                     <!--[if (gte mso 9)|(IE)]>
//             <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
//             <tr>
//             <td align="center" valign="top" width="600">
//             <![endif]-->
//                     <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">

          

//                         <!-- start button -->
//                         <tr>
//                             <td align="left" bgcolor="#ffffff">
//                                 <table border="0" cellpadding="0" cellspacing="0" width="100%">
//                                     <tr>
//                                         <td align="center" bgcolor="#ffffff" style="padding: 12px;">
//                                             <table border="0" cellpadding="0" cellspacing="0">
//                                                 <tr>
//                                                     <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;">
//                                                         <a href="${process.env.CLIENT_URL}auth/reset-password/${token.token}"
//                                                             target="_blank"
//                                                             style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">
//                                                             Reset Password</a>
//                                                     </td>
//                                                 </tr>
//                                             </table>
//                                         </td>
//                                     </tr>
//                                 </table>
//                             </td>
//                         </tr>
//                         <!-- end button -->

//                         <!-- start copy -->
//                         <tr>
//                             <td align="left" bgcolor="#ffffff"
//                                 style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
//                                 <p style="margin: 0;">If that doesn't work, copy and paste the following link in your
//                                     browser:</p>
//                                 <p style="margin: 0;"><a
//                                         href="${process.env.CLIENT_URL}auth/reset-password/${token.token}"
//                                         target="_blank">${process.env.CLIENT_URL}auth/reset-password/${token.token}</a>
//                                 </p>
//                             </td>
//                         </tr>
//                         <!-- end copy -->

//                         <!-- start copy -->
//                         <tr>
//                             <td align="left" bgcolor="#ffffff"
//                                 style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">
//                                 <p style="margin: 0;">Thank you, <br />
//                                     The DesignPrintNYC Team</p>
//                             </td>
//                         </tr>
//                         <!-- end copy -->

//                     </table>
//                     <!--[if (gte mso 9)|(IE)]>
//             </td>
//             </tr>
//             </table>
//             <![endif]-->
//                 </td>
//             </tr>
//             <!-- end copy block -->

//             <!-- start footer -->
//             <tr>
//                 <td align="center" bgcolor="#e9ecef" style="padding: 24px;">
//                     <!--[if (gte mso 9)|(IE)]>
//             <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
//             <tr>
//             <td align="center" valign="top" width="600">
//             <![endif]-->
//                     <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">

//                         <!-- start permission -->
//                         <tr>
//                             <td align="center" bgcolor="#e9ecef"
//                                 style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
//                                 <p style="margin: 0;">You received this email because we received a request for RESET PASSWORD
//                                     of your account. If you didn't request RESET PASSWORD you can safely delete this email.
//                                 </p>
//                             </td>
//                         </tr>
//                     </table>
//                     <!--[if (gte mso 9)|(IE)]>
//             </td>
//             </tr>
//             </table>
//             <![endif]-->
//                 </td>
//             </tr>
//             <!-- end footer -->

//         </table>
//         <!-- end body -->

//     </body>

//   </html>`;
// };

const resetPasswordEmailTemplate = (token, settings, name) => { 
    const clientUrl = settings.storeURL ; 
    const resetLink = `${clientUrl}auth/reset-password/${token?.token || 'INVALID_TOKEN'}`; 
    const companyWebsite = settings.storeURL; 
    const companyEmail = settings.email;
    const apiUrl = settings.apiUrl;
    const completeLogoUrl = apiUrl + settings.logo; 
    const address = settings.address;
    const phoneNumber = settings.phoneNumber;
    const email = settings.email;
    const brandColor = settings.primaryColor;
    const storeName = settings.storeName;
    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="utf-8">
      <meta http-equiv="x-ua-compatible" content="ie=edge">
      <title>Forgot Password</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style type="text/css">
          /* Base Styles */
          body, table, td, a { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }
          table, td { mso-table-rspace: 0pt; mso-table-lspace: 0pt; }
          img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
          table { border-collapse: collapse !important; }
          body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #f8f9fa; /* Light grey background */ }
  
          /* Link Styles */
          a { color:${brandColor} ; /* Green links */ text-decoration: none; }
          a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
  
          /* Responsive Styles */
          @media screen and (max-width: 600px) {
              .content-table { width: 100% !important; max-width: 100% !important; }
              .content-cell { padding-left: 15px !important; padding-right: 15px !important; }
              .logo { width: 150px !important; height: auto !important; }
              h1 { font-size: 24px !important; line-height: 32px !important; }
          }
      </style>
  </head>
  <body style="margin: 0 !important; padding: 0 !important; background-color: #f8f9fa;">
  
      <!-- Preheader (Optional, Hidden) -->
      <div style="display: none; max-height: 0; overflow: hidden;">
          Reset your password for ${storeName}.
      </div>
  
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
          <!-- Body Wrapper -->
          <tr>
              <td align="center" valign="top" bgcolor="#f8f9fa" style="padding: 20px 0;">
                  <!--[if (gte mso 9)|(IE)]>
                  <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                  <tr>
                  <td align="center" valign="top" width="600">
                  <![endif]-->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" class="content-table" style="max-width: 600px; background-color: #ffffff; border-radius: 4px; overflow: hidden;">
  
                      <!-- Logo -->
                      <tr>
                          <td align="left" valign="top" class="content-cell" style="padding: 24px 24px 16px 24px;">
                               <!-- === LOGO PLACEHOLDER === -->
                               <img src="${completeLogoUrl}" alt="Company Logo" border="0" class="logo" style="display: block; width: 180px;"> <!-- ======================== -->
                          </td>
                      </tr>
  
                      <!-- Content Area -->
                      <tr>
                          <td align="left" valign="top" class="content-cell" style="padding: 0 24px 24px 24px; font-family: Arial, sans-serif; font-size: 15px; line-height: 24px; color: #333333;">
  
                              <!-- Heading -->
                              <h1 style="margin: 0 0 20px 0; font-size: 28px; font-weight: bold; line-height: 36px; color: ${brandColor};">
                                  Forgot Password
                              </h1>
  
                              <!-- Greeting -->
                              <p style="margin: 0 0 16px 0;">
                                  <strong style="color: #000000;">Dear ${name || 'User'},</strong>
                              </p>
  
                              <!-- Main Text -->
                              <p style="margin: 0 0 16px 0;">
                                  You have requested to reset your password.
                              </p>
                              <p style="margin: 0 0 16px 0;">
                                  <a href="${resetLink}" target="_blank" style="color: ${brandColor}; font-weight: bold; text-decoration: none;">CLICK HERE</a> to reset your password
                              </p>
                              <p style="margin: 0 0 16px 0;">
                                  You are advised to change your password on your account page.
                              </p>
                              <p style="margin: 0 0 24px 0;">
                                  Design a unique identity for yourself and your business log on to <a href="${companyWebsite}" target="_blank" style="color: ${brandColor}; text-decoration: none;">${storeName}</a>
                              </p>
  
                              <!-- Regards -->
                              <p style="margin: 0 0 4px 0;">
                                  Regards
                              </p>
                              <p style="margin: 0 0 24px 0;">
                                  Customer Care
                              </p>
  
                              <!-- Address Block -->
                              <p style="margin: 0 0 4px 0;">
                                  <strong style="color: #000000;">Main address</strong>
                              </p>
                              <p style="margin: 0;">
                                  ${address}
                              </p>
                              <p style="margin: 0;">
                                  ${phoneNumber}
                              </p>
                              <p style="margin: 0;">
                                  <a href="mailto:${email}" style="color:#449299; text-decoration: none;">${companyEmail}</a>
                              </p>
  
                          </td>
                      </tr>
                      <!-- End Content Area -->
  
                  </table>
                  <!--[if (gte mso 9)|(IE)]>
                  </td>
                  </tr>
                  </table>
                  <![endif]-->
              </td>
          </tr>
          <!-- End Body Wrapper -->
  
          <!-- Footer Area (Optional - for unsubscribe, etc. Kept minimal here) -->
          <tr>
              <td align="center" valign="top" bgcolor="#f8f9fa" style="padding: 24px;">
                   <!--[if (gte mso 9)|(IE)]>
                  <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                  <tr>
                  <td align="center" valign="top" width="600">
                  <![endif]-->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                      <tr>
                          <td align="center" valign="top" style="padding: 0; font-family: Arial, sans-serif; font-size: 12px; line-height: 18px; color: #666666;">
                              <p style="margin: 0;">You received this email because a password reset was requested for your account.</p>
                              <p style="margin: 5px 0 0 0;">If you did not request this, please ignore this email.</p>
                              <!-- Add address, unsubscribe link here if needed -->
                          </td>
                      </tr>
                  </table>
                  <!--[if (gte mso 9)|(IE)]>
                  </td>
                  </tr>
                  </table>
                  <![endif]-->
              </td>
          </tr>
          <!-- End Footer -->
  
      </table>
  
  </body>
  </html>
  `;
  };

const virginMaryChurchNewsLetter = () => {
  return `
    <!DOCTYPE html>
      <html>
  
      <head>
  
          <meta charset="utf-8">
          <meta http-equiv="x-ua-compatible" content="ie=edge">
          <title>Email Confirmation</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style type="text/css">
              /**
         * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
         */
              @media screen {
                  @font-face {
                      font-family: 'Source Sans Pro';
                      font-style: normal;
                      font-weight: 400;
                      src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
                  }
  
                  @font-face {
                      font-family: 'Source Sans Pro';
                      font-style: normal;
                      font-weight: 700;
                      src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
                  }
              }
  
              /**
         * Avoid browser level font resizing.
         * 1. Windows Mobile
         * 2. iOS / OSX
         */
              body,
              table,
              td,
              a {
                  -ms-text-size-adjust: 100%;
                  /* 1 */
                  -webkit-text-size-adjust: 100%;
                  /* 2 */
              }
  
              /**
         * Remove extra space added to tables and cells in Outlook.
         */
              table,
              td {
                  mso-table-rspace: 0pt;
                  mso-table-lspace: 0pt;
              }
  
              /**
         * Better fluid images in Internet Explorer.
         */
              img {
                  -ms-interpolation-mode: bicubic;
              }
  
              /**
         * Remove blue links for iOS devices.
         */
              a[x-apple-data-detectors] {
                  font-family: inherit !important;
                  font-size: inherit !important;
                  font-weight: inherit !important;
                  line-height: inherit !important;
                  color: inherit !important;
                  text-decoration: none !important;
              }
  
              /**
         * Fix centering issues in Android 4.4.
         */
              div[style*="margin: 16px 0;"] {
                  margin: 0 !important;
              }
  
              body {
                  width: 100% !important;
                  height: 100% !important;
                  padding: 0 !important;
                  margin: 0 !important;
              }
  
              /**
         * Collapse table borders to avoid space between cells.
         */
              table {
                  border-collapse: collapse !important;
              }
  
              a {
                  color: #1a82e2;
              }
  
              img {
                  height: auto;
                  line-height: 100%;
                  text-decoration: none;
                  border: 0;
                  outline: none;
              }
          </style>
  
      </head>
  
      <body style="background-color: #e9ecef;">
  
  
          <!-- start body -->
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
  
              <!-- start logo -->
              <tr>
                  <td align="center" bgcolor="#e9ecef">
                      <!--[if (gte mso 9)|(IE)]>
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
              <tr>
              <td align="center" valign="top" width="600">
              <![endif]-->
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                          <tr>
                              <td align="center" valign="top" style="padding: 36px 24px;">
                                  <a href="${process.env.CLIENT_URL}" target="_blank" style="display: inline-block;">
                                      <img src="https://ehfakgf.stripocdn.email/content/guids/CABINET_e3dae694c00edbfc06ed9413cf7d63bf49202f8faad0a838d9a5196419c85338/images/logo.png"
                                          alt="Logo" border="0" style="display: block; width: 200px;">
                                  </a>
                              </td>
                          </tr>
                      </table>
                      <!--[if (gte mso 9)|(IE)]>
              </td>
              </tr>
              </table>
              <![endif]-->
                  </td>
              </tr>
              <!-- end logo -->
  
              <!-- start hero -->
              <tr>
                  <td align="center" bgcolor="#e9ecef">
                      <!--[if (gte mso 9)|(IE)]>
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
              <tr>
              <td align="center" valign="top" width="600">
              <![endif]-->
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                          <tr>
                              <td align="left" bgcolor="#ffffff"
                                  style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
                                  <h1
                                      style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">
                                      Thank you for subscribing Designprint NYC Newsletter</h1>
                              </td>
                          </tr>
                      </table>
                      <!--[if (gte mso 9)|(IE)]>
              </td>
              </tr>
              </table>
              <![endif]-->
                  </td>
              </tr>
              <!-- end hero -->
  
              <!-- start copy block -->
              <tr>
                  <td align="center" bgcolor="#e9ecef">
                      <!--[if (gte mso 9)|(IE)]>
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
              <tr>
              <td align="center" valign="top" width="600">
              <![endif]-->
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
  
            
  
                          <!-- start copy -->
                          <tr>
                              <td align="left" bgcolor="#ffffff"
                                  style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                                  <p style="margin: 0;">You have been awarded with 20% off on every order on <a href="https://prod.designprintnyc.com">www.designprintnyc.com</a>. Please use the following voucher code on checkout</p>
                                    <p style="font-size:32px; text-align:center">VMOC0720</p>  
                                  <p style="margin: 0;">In case of any query, please contact us at (631) 572-5131 or email us at info@designprintnyc.com</p>
                            <p style="margin: 0; font-weight:bold">To radeem this voucher via phone order, give us a call</p>
                                  </td>
                          </tr>
                          <!-- end copy -->
  
                          <!-- start copy -->
                          <tr>
                              <td align="left" bgcolor="#ffffff"
                                  style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">
                                  <p style="margin: 0;">Thank you, <br />
                                      The DesignPrintNYC Team</p>
                              </td>
                          </tr>
                          <!-- end copy -->
  
                      </table>
                      <!--[if (gte mso 9)|(IE)]>
              </td>
              </tr>
              </table>
              <![endif]-->
                  </td>
              </tr>
              <!-- end copy block -->
  
              <!-- start footer -->
              <tr>
                  <td align="center" bgcolor="#e9ecef" style="padding: 24px;">
                      <!--[if (gte mso 9)|(IE)]>
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
              <tr>
              <td align="center" valign="top" width="600">
              <![endif]-->
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
  
                          <!-- start permission -->
                          <tr>
                              <td align="center" bgcolor="#e9ecef"
                                  style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                                  <p style="margin: 0;">
                                  </p>
                              </td>
                          </tr>
                      </table>
                      <!--[if (gte mso 9)|(IE)]>
              </td>
              </tr>
              </table>
              <![endif]-->
                  </td>
              </tr>
              <!-- end footer -->
  
          </table>
          <!-- end body -->
  
      </body>
  
    </html>`;
};

const eventSubscribeTemplate = (lastname) => {
  return `
      <!DOCTYPE html>
        <html>
    
        <head>
    
            <meta charset="utf-8">
            <meta http-equiv="x-ua-compatible" content="ie=edge">
            <title>Email Confirmation</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style type="text/css">
                /**
           * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
           */
                @media screen {
                    @font-face {
                        font-family: 'Source Sans Pro';
                        font-style: normal;
                        font-weight: 400;
                        src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
                    }
    
                    @font-face {
                        font-family: 'Source Sans Pro';
                        font-style: normal;
                        font-weight: 700;
                        src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
                    }
                }
    
                /**
           * Avoid browser level font resizing.
           * 1. Windows Mobile
           * 2. iOS / OSX
           */
                body,
                table,
                td,
                a {
                    -ms-text-size-adjust: 100%;
                    /* 1 */
                    -webkit-text-size-adjust: 100%;
                    /* 2 */
                }
    
                /**
           * Remove extra space added to tables and cells in Outlook.
           */
                table,
                td {
                    mso-table-rspace: 0pt;
                    mso-table-lspace: 0pt;
                }
    
                /**
           * Better fluid images in Internet Explorer.
           */
                img {
                    -ms-interpolation-mode: bicubic;
                }
    
                /**
           * Remove blue links for iOS devices.
           */
                a[x-apple-data-detectors] {
                    font-family: inherit !important;
                    font-size: inherit !important;
                    font-weight: inherit !important;
                    line-height: inherit !important;
                    color: inherit !important;
                    text-decoration: none !important;
                }
    
                /**
           * Fix centering issues in Android 4.4.
           */
                div[style*="margin: 16px 0;"] {
                    margin: 0 !important;
                }
    
                body {
                    width: 100% !important;
                    height: 100% !important;
                    padding: 0 !important;
                    margin: 0 !important;
                }
    
                /**
           * Collapse table borders to avoid space between cells.
           */
                table {
                    border-collapse: collapse !important;
                }
    
                a {
                    color: #1a82e2;
                }
    
                img {
                    height: auto;
                    line-height: 100%;
                    text-decoration: none;
                    border: 0;
                    outline: none;
                }
            </style>
    
        </head>
    
        <body style="background-color: #e9ecef;">
    
    
            <!-- start body -->
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
    
                <!-- start logo -->
                <tr>
                    <td align="center" bgcolor="#e9ecef">
                        <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                <tr>
                <td align="center" valign="top" width="600">
                <![endif]-->
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                            <tr>
                                <td align="center" valign="top" style="padding: 36px 24px;">
                                    <a href="${process.env.CLIENT_URL}" target="_blank" style="display: inline-block;">
                                        <img src="https://ehfakgf.stripocdn.email/content/guids/CABINET_e3dae694c00edbfc06ed9413cf7d63bf49202f8faad0a838d9a5196419c85338/images/logo.png"
                                            alt="Logo" border="0" style="display: block; width: 200px;">
                                    </a>
                                </td>
                            </tr>
                        </table>
                        <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
                    </td>
                </tr>
                <!-- end logo -->
    
                <!-- start hero -->
                <tr>
                    <td align="center" bgcolor="#e9ecef">
                        <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                <tr>
                <td align="center" valign="top" width="600">
                <![endif]-->
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                            <tr>
                                <td align="left" bgcolor="#ffffff"
                                    style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
                                    <h1
                                        style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">
                                        Hi ${lastname}</h1>
                                </td>
                            </tr>
                        </table>
                        <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
                    </td>
                </tr>
                <!-- end hero -->
    
                <!-- start copy block -->
                <tr>
                    <td align="center" bgcolor="#e9ecef">
                        <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                <tr>
                <td align="center" valign="top" width="600">
                <![endif]-->
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
    
              
    
                            <!-- start copy -->
                            <tr>
                                <td align="left" bgcolor="#ffffff"
                                    style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                                    <p style="margin: 0;">Thank you for subscribing Designprint NYC at Printing United Expo 2024 Las Vegas NV. <br/> One of our team member  will get back to you after the event.</p>
                                    <br/>
                                    <p style="margin: 0;">In case of any query, please contact us at <a href="tel:+1 (631) 572-5131">+1 (631) 572-5131</a> or email us at <a href="mailto:info@designprintnyc.com">info@designprintnyc.com</a></p>
                                    </td>
                            </tr>
                            <!-- end copy -->
    
                            <!-- start copy -->
                            <tr>
                                <td align="left" bgcolor="#ffffff"
                                    style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">
                                    <p style="margin: 0;">Thank you, <br />
                                        The DesignPrintNYC Team</p>
                                        
                                        <div style="display:flex; justify-content:center;align-items:center; margin-top:40px; gap:20px">
                                            <a href="https://www.instagram.com/designprintnyc">
                                                
                                            <img style="width:50px" src="https://img.icons8.com/?size=100&id=32323&format=png&color=000000" alt="instagram"/>
                                            </a>
                                            <a href="https://www.facebook.com/designprintnyc?mibextid=9R9pXO">
                                                
                                            <img style="width:50px" src="https://img.icons8.com/?size=100&id=118497&format=png&color=000000" alt="instagram"/>
                                            </a>
                                            <a href="https://www.linkedin.com/company/designprint-nyc/">
                                                
                                            <img style="width:50px" src="https://img.icons8.com/?size=100&id=13930&format=png&color=000000" alt="instagram"/>
                                            </a>
                                            <a href="https://youtube.com/@designprintnyc?si=yfOnk16z_rRXpQnC">
                                                
                                            <img style="width:50px" src="https://img.icons8.com/?size=100&id=19318&format=png&color=000000" alt="instagram"/>
                                            </a>
                                            
                                        </div>
                                </td>
                      
                            </tr>
                            <!-- end copy -->
    
                        </table>
                        <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
                    </td>
                </tr>
                <!-- end copy block -->
    
                <!-- start footer -->
                <tr>
                    <td align="center" bgcolor="#e9ecef" style="padding: 24px;">
                        <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                <tr>
                <td align="center" valign="top" width="600">
                <![endif]-->
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
    
                            <!-- start permission -->
                            <tr>
                                <td align="center" bgcolor="#e9ecef"
                                    style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                                    <p style="margin: 0;">
                                    </p>
                                </td>
                            </tr>
                        </table>
                        <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
                    </td>
                </tr>
                <!-- end footer -->
    
            </table>
            <!-- end body -->
    
        </body>
    
      </html>`;
};

// const verifyAccountEmailTemplate = (user, token) => {
//   return `
//   <!DOCTYPE html>
//     <html>

//     <head>

//         <meta charset="utf-8">
//         <meta http-equiv="x-ua-compatible" content="ie=edge">
//         <title>Email Confirmation</title>
//         <meta name="viewport" content="width=device-width, initial-scale=1">
//         <style type="text/css">
//             /**
//        * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
//        */
//             @media screen {
//                 @font-face {
//                     font-family: 'Source Sans Pro';
//                     font-style: normal;
//                     font-weight: 400;
//                     src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
//                 }

//                 @font-face {
//                     font-family: 'Source Sans Pro';
//                     font-style: normal;
//                     font-weight: 700;
//                     src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
//                 }
//             }

//             /**
//        * Avoid browser level font resizing.
//        * 1. Windows Mobile
//        * 2. iOS / OSX
//        */
//             body,
//             table,
//             td,
//             a {
//                 -ms-text-size-adjust: 100%;
//                 /* 1 */
//                 -webkit-text-size-adjust: 100%;
//                 /* 2 */
//             }

//             /**
//        * Remove extra space added to tables and cells in Outlook.
//        */
//             table,
//             td {
//                 mso-table-rspace: 0pt;
//                 mso-table-lspace: 0pt;
//             }

//             /**
//        * Better fluid images in Internet Explorer.
//        */
//             img {
//                 -ms-interpolation-mode: bicubic;
//             }

//             /**
//        * Remove blue links for iOS devices.
//        */
//             a[x-apple-data-detectors] {
//                 font-family: inherit !important;
//                 font-size: inherit !important;
//                 font-weight: inherit !important;
//                 line-height: inherit !important;
//                 color: inherit !important;
//                 text-decoration: none !important;
//             }

//             /**
//        * Fix centering issues in Android 4.4.
//        */
//             div[style*="margin: 16px 0;"] {
//                 margin: 0 !important;
//             }

//             body {
//                 width: 100% !important;
//                 height: 100% !important;
//                 padding: 0 !important;
//                 margin: 0 !important;
//             }

//             /**
//        * Collapse table borders to avoid space between cells.
//        */
//             table {
//                 border-collapse: collapse !important;
//             }

//             a {
//                 color: #1a82e2;
//             }

//             img {
//                 height: auto;
//                 line-height: 100%;
//                 text-decoration: none;
//                 border: 0;
//                 outline: none;
//             }
//         </style>

//     </head>

//     <body style="background-color: #e9ecef;">

//         <!-- start preheader -->
//         <div class="preheader"
//             style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
//             A preheader is the short summary text that follows the subject line when an email is viewed in the inbox.
//         </div>
//         <!-- end preheader -->

//         <!-- start body -->
//         <table border="0" cellpadding="0" cellspacing="0" width="100%">

//             <!-- start logo -->
//             <tr>
//                 <td align="center" bgcolor="#e9ecef">
//                     <!--[if (gte mso 9)|(IE)]>
//             <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
//             <tr>
//             <td align="center" valign="top" width="600">
//             <![endif]-->
//                     <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
//                         <tr>
//                             <td align="center" valign="top" style="padding: 36px 24px;">
//                                 <a href="${process.env.CLIENT_URL}" target="_blank" style="display: inline-block;">
//                                     <img src="https://ehfakgf.stripocdn.email/content/guids/CABINET_e3dae694c00edbfc06ed9413cf7d63bf49202f8faad0a838d9a5196419c85338/images/logo.png"
//                                         alt="Logo" border="0" style="display: block; width: 200px;">
//                                 </a>
                                
//                             </td>
//                         </tr>
//                     </table>
//                     <!--[if (gte mso 9)|(IE)]>
//             </td>
//             </tr>
//             </table>
//             <![endif]-->
//                 </td>
//             </tr>
//             <!-- end logo -->

//             <!-- start hero -->
//             <tr>
//                 <td align="center" bgcolor="#e9ecef">
//                     <!--[if (gte mso 9)|(IE)]>
//             <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
//             <tr>
//             <td align="center" valign="top" width="600">
//             <![endif]-->
//                     <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
//                         <tr>
//                             <td align="left" bgcolor="#ffffff"
//                                 style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
//                                 <h1
//                                     style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">
//                                     Confirm Your Email Address</h1>
//                             </td>
//                         </tr>
//                     </table>
//                     <!--[if (gte mso 9)|(IE)]>
//             </td>
//             </tr>
//             </table>
//             <![endif]-->
//                 </td>
//             </tr>
//             <!-- end hero -->

//             <!-- start copy block -->
//             <tr>
//                 <td align="center" bgcolor="#e9ecef">
//                     <!--[if (gte mso 9)|(IE)]>
//             <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
//             <tr>
//             <td align="center" valign="top" width="600">
//             <![endif]-->
//                     <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">

//                         <!-- start copy -->
//                         <tr>
//                             <td align="left" bgcolor="#ffffff"
//                                 style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
//                                 <p style="margin: 0;">Thank you for signing up with DesignPrintNYC! <br /> To ensure that we
//                                     have the correct email address and to activate your account, please click on the button
//                                     below to verify your email:</p>
//                             </td>
//                         </tr>
//                         <!-- end copy -->

//                         <!-- start button -->
//                         <tr>
//                             <td align="left" bgcolor="#ffffff">
//                                 <table border="0" cellpadding="0" cellspacing="0" width="100%">
//                                     <tr>
//                                         <td align="center" bgcolor="#ffffff" style="padding: 12px;">
//                                             <table border="0" cellpadding="0" cellspacing="0">
//                                                 <tr>
//                                                     <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;">
//                                                         <a href="${process.env.CLIENT_URL}auth/${user.id}/verify/${token.token}"
//                                                             target="_blank"
//                                                             style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">Verify
//                                                             Account</a>
//                                                     </td>
//                                                 </tr>
//                                             </table>
//                                         </td>
//                                     </tr>
//                                 </table>
//                             </td>
//                         </tr>
//                         <!-- end button -->

//                         <!-- start copy -->
//                         <tr>
//                             <td align="left" bgcolor="#ffffff"
//                                 style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
//                                 <p style="margin: 0;">If that doesn't work, copy and paste the following link in your
//                                     browser:</p>
//                                 <p style="margin: 0;"><a
//                                         href="${process.env.CLIENT_URL}auth/${user.id}/verify/${token.token}"
//                                         target="_blank">${process.env.CLIENT_URL}auth/${user.id}/verify/${token.token}</a>
//                                 </p>
//                             </td>
//                         </tr>
//                         <!-- end copy -->

//                         <!-- start copy -->
//                         <tr>
//                             <td align="left" bgcolor="#ffffff"
//                                 style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">
//                                 <p style="margin: 0;">Thank you, <br />
//                                     The DesignPrintNYC Team</p>
//                             </td>
//                         </tr>
//                         <!-- end copy -->

//                     </table>
//                     <!--[if (gte mso 9)|(IE)]>
//             </td>
//             </tr>
//             </table>
//             <![endif]-->
//                 </td>
//             </tr>
//             <!-- end copy block -->

//             <!-- start footer -->
//             <tr>
//                 <td align="center" bgcolor="#e9ecef" style="padding: 24px;">
//                     <!--[if (gte mso 9)|(IE)]>
//             <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
//             <tr>
//             <td align="center" valign="top" width="600">
//             <![endif]-->
//                     <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">

//                         <!-- start permission -->
//                         <tr>
//                             <td align="center" bgcolor="#e9ecef"
//                                 style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
//                                 <p style="margin: 0;">You received this email because we received a request for REGISTRATION
//                                     of your account. If you didn't request REGISTRATION you can safely delete this email.
//                                 </p>
//                             </td>
//                         </tr>
//                         <!-- end permission -->

//                         <!-- start unsubscribe -->
//                         <!--<tr>-->
//                         <!--  <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">-->
//                         <!--    <p style="margin: 0;">To stop receiving these emails, you can <a href="https://www.blogdesire.com" target="_blank">unsubscribe</a> at any time.</p>-->
//                         <!--    <p style="margin: 0;">Paste 1234 S. Broadway St. City, State 12345</p>-->
//                         <!--  </td>-->
//                         <!--</tr>-->
//                         <!-- end unsubscribe -->

//                     </table>
//                     <!--[if (gte mso 9)|(IE)]>
//             </td>
//             </tr>
//             </table>
//             <![endif]-->
//                 </td>
//             </tr>
//             <!-- end footer -->

//         </table>
//         <!-- end body -->

//     </body>

//   </html>`;
// };


const verifyAccountEmailTemplate = (user, token, settings) => { 
  const clientUrl = settings.storeURL; 
  const accountVerifyLink = `${clientUrl}/auth/${user.id}/verify/${token.token}`; 
  const companyWebsite = clientUrl; 
  const companyEmail = settings.email; 
  const userName = user?.name || user?.firstName || 'Valued Customer'; 
  const userEmail = user?.email ; 
  const apiUrl = settings.apiUrl;
  const completeLogoUrl = apiUrl + settings.logo;
  const address = settings.address;
  const phoneNumber = settings.phoneNumber;
  const email = settings.email;
  const brandColor = settings.primaryColor;
  const storeName = settings.storeName;
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>Welcome to ${storeName}!</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style type="text/css">
        /* Base Styles */
        body, table, td, a { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }
        table, td { mso-table-rspace: 0pt; mso-table-lspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        table { border-collapse: collapse !important; }
        body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #f8f9fa; /* Light grey background */ }

        /* Link Styles */
        a { color: 
${brandColor}; /* Green links */ text-decoration: none; }
        a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }

        /* Responsive Styles */
        @media screen and (max-width: 600px) {
            .content-table { width: 100% !important; max-width: 100% !important; }
            .content-cell { padding-left: 15px !important; padding-right: 15px !important; }
            .logo { width: 150px !important; height: auto !important; }
            h1 { font-size: 24px !important; line-height: 32px !important; }
        }
    </style>
</head>
<body style="margin: 0 !important; padding: 0 !important; background-color: #f8f9fa;">

    <!-- Preheader (Optional, Hidden) -->
    <div style="display: none; max-height: 0; overflow: hidden;">
        Welcome to ${storeName}! Your account details are inside.
    </div>

    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <!-- Body Wrapper -->
        <tr>
            <td align="center" valign="top" bgcolor="#f8f9fa" style="padding: 20px 0;">
                <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                <tr>
                <td align="center" valign="top" width="600">
                <![endif]-->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" class="content-table" style="max-width: 600px; background-color: #ffffff; border-radius: 4px; overflow: hidden;">

                    <!-- Logo -->
                    <tr>
                        <td align="left" valign="top" class="content-cell" style="padding: 24px 24px 16px 24px;">
                             <!-- === LOGO PLACEHOLDER === -->
                             <img src="${completeLogoUrl}" alt="Company Logo" border="0" class="logo" style="display: block; width: 180px;">
                             <!-- ======================== -->
                        </td>
                    </tr>

                    <!-- Content Area -->
                    <tr>
                        <td align="left" valign="top" class="content-cell" style="padding: 0 24px 24px 24px; font-family: Arial, sans-serif; font-size: 15px; line-height: 24px; color: #333333;">

                            <!-- Heading -->
                            <h1 style="margin: 0 0 20px 0; font-size: 28px; font-weight: bold; line-height: 36px; color:#449299;">
                                On Sign Up
                            </h1>

                            <!-- Greeting -->
                            <p style="margin: 0 0 16px 0;">
                                <strong style="color: #000000;">Dear ${userName},</strong>
                            </p>

                            <!-- Welcome Text -->
                            <p style="margin: 0 0 24px 0;">
                                want to personally welcome you to ${storeName}. Thank you for registering with us and I hope it marks the beginning of long-lasting business relationship between us
                            </p>

                            <!-- Account Details Section -->
                            <p style="margin: 0 0 8px 0;">
                                <strong style="color: #000000;">Your Account Details</strong>
                            </p>
                            <p style="margin: 0 0 4px 0;">
                                Email ID: <a href="mailto:${userEmail}" style="color: #449299; text-decoration: none;">${userEmail}</a>
                            </p>
                            

                            <!-- Update Link -->
                            <p style="margin: 0 0 16px 0;">
                                <a href="${accountVerifyLink}" target="_blank" style="color:#449299; font-weight: bold; text-decoration: none;">CLICK HERE </a>to verify your account.
                            </p>

                             <!-- Website Promo -->
                            <p style="margin: 0 0 24px 0;">
                                Design a unique identity for yourself and your business log on to <a href="${companyWebsite}" target="_blank" style="color:#449299; text-decoration: none;">${clientUrl}</a>
                            </p>

                            <!-- Regards -->
                            <p style="margin: 0 0 4px 0;">
                                Regards
                            </p>
                            <p style="margin: 0 0 24px 0;">
                                Customer Care
                            </p>

                            <!-- Address Block -->
                            <p style="margin: 0 0 4px 0;">
                                <strong style="color: #000000;">Main address</strong>
                            </p>
                            <p style="margin: 0;">
                                ${address}
                            </p>
                            <p style="margin: 0;">
                               ${phoneNumber}
                            </p>
                            <p style="margin: 0;">
                               <a href="mailto:${email}" style="color:#449299; text-decoration: none;">${companyEmail}</a>
                            </p>

                        </td>
                    </tr>
                    <!-- End Content Area -->

                </table>
                <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
            </td>
        </tr>
        <!-- End Body Wrapper -->

         <!-- Footer Area (Minimal) -->
        <tr>
            <td align="center" valign="top" bgcolor="#f8f9fa" style="padding: 24px;">
                 <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                <tr>
                <td align="center" valign="top" width="600">
                <![endif]-->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td align="center" valign="top" style="padding: 0; font-family: Arial, sans-serif; font-size: 12px; line-height: 18px; color: #666666;">
                            <p style="margin: 0;">You received this email because you successfully registered an account with ${storeName}</p>
                            <!-- Consider adding contact/support link -->
                        </td>
                    </tr>
                </table>
                <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
            </td>
        </tr>
        <!-- End Footer -->

    </table>

</body>
</html>
`;
};


// const sendOrderEmailTemplate = (order) => {
//   const shipmentDetail = (shipment) => {
//     if (shipment.shippingType === "pickup") {
//       return `
//                 <section>
//                         <table style="width: 100%;">
//                             <tr>
//                                 <td>
//                                     <div>
//                                         <h1 style="font-weight: bold; font-size: 14px;">PICKUP ADDRESS</h1>
//                                         <p style="font-size: 14px;">${shipment.pickupAddress.street}</p>
//                                         <p style="font-size: 14px;">${shipment.pickupAddress.city}</p>
//                                         <p style="font-size: 14px;">${shipment.pickupAddress.state}</p>
                                        
 
//                                     </div>
//                                 </td>

//                                 <td>
//                                     <div>
//                                         <h1 style="font-weight: bold;"> ESTIMATED IN-HAND DATE</h1>
//                                         <p>${shipment.shippingDates.deliveryDate}</p>
//                                         <p>if cut off time is met</p>
//                                     </div>
//                                 </td>

//                                 <td>
//                                     <div>
//                                         <h1 style="font-weight: 500; margin-bottom: 8px;">Shipping Cost</h1>
//                                         <hr style="margin-top: 4px; margin-bottom: 4px; border-top: 2px solid black;" />

//                                         <table>
//                                             <tr>
//                                                 <td>
//                                                     <h1 style="color: black; font-weight: 500;">Shipping Fee:</h1>
//                                                 </td>
//                                                 <td>
//                                                     <h1>$ 0</h1>
//                                                 </td>
//                                             </tr>
//                                             <tr>
//                                                 <td>
//                                                     <h1 style="color: black; font-weight: 500;">Total Sets:</h1>
//                                                 </td>
//                                                 <td>
//                                                     <h1>${shipment.sets.length}</h1>
//                                                 </td>
//                                             </tr>
//                                         </table>
//                                     </div>
//                                 </td>
//                             </tr>
//                         </table>
//                     </section>
//             `;
//     } else {
//       return `
//                     <section>
//                         <table style="width: 100%;">
//                             <tr>
//                                 <td>
//                                     <div>
//                                         <h1 style="font-weight: bold; font-size: 14px;">SHIP TO</h1>
//                                         <p style="font-size: 14px;">${
//                                           shipment.shippingAddress.firstName
//                                         }${shipment.shippingAddress.lastName}</p>
//                                         <p style="font-size: 14px;">${
//                                           shipment.shippingAddress.companyName
//                                         }</p>
//                                         <p style="font-size: 14px;">${
//                                           shipment.shippingAddress.streetAddress
//                                         }</p>
//                                         <p style="font-size: 14px;">${
//                                           shipment.shippingAddress.city
//                                         },${shipment.shippingAddress.state},${
//         shipment.shippingAddress.zipCode
//       }</p>
//                                         <p style="font-size: 14px;">${
//                                           shipment.shippingAddress.country
//                                         }</p>
//                                         <p style="font-size: 14px;">T:${
//                                           shipment.shippingAddress.phoneNumber || " N/A"
//                                         }</p>
//                                     </div>
//                                 </td>

//                                 <td>
//                                     <div>
//                                         <h1 style="font-weight: bold;"> ESTIMATED IN-HAND DATE</h1>
//                                         <p>${shipment.shippingDates.deliveryDate}</p>
//                                         <p>if cut off time is met</p>
//                                     </div>
//                                     <div>
//                                         <h1 style="font-weight: bold;">SHIPPING METHOD</h1>
//                                         <p>${
//                                           upsServiceCodes[shipment.shippingMethod.Service.Code]
//                                         }</p>
//                                     </div>
//                                 </td>

//                                 <td>
//                                     <div>
//                                         <h1 style="font-weight: 500; margin-bottom: 8px;">Shipping Cost</h1>
//                                         <hr style="margin-top: 4px; margin-bottom: 4px; border-top: 2px solid black;" />

//                                         <table>
//                                             <tr>
//                                                 <td>
//                                                     <h1 style="color: black; font-weight: 500;">Shipping Fee:</h1>
//                                                 </td>
//                                                 <td>
//                                                     <h1>$ ${formatPrice(
//                                                       parseFloat(
//                                                         shipment.shippingMethod.TotalCharges
//                                                           .MonetaryValue
//                                                       )
//                                                     )}</h1>
//                                                 </td>
//                                             </tr>
//                                             <tr>
//                                                 <td>
//                                                     <h1 style="color: black; font-weight: 500;">Total Sets:</h1>
//                                                 </td>
//                                                 <td>
//                                                     <h1>${shipment.sets.length}</h1>
//                                                 </td>
//                                             </tr>
//                                         </table>
//                                     </div>
//                                 </td>
//                             </tr>
//                         </table>
//                     </section>
//             `;
//     }
//   };
//   return `
// <!DOCTYPE html>
// <html>
//     <head>
//         <meta charset="UTF-8" />
//         <meta name="viewport" content="width=device-width, initial-scale=1.0" />

//         <style>
//             /* Include Tailwind CSS directly */
//             /* You can customize these styles according to your needs */
//             @import url("https://cdn.jsdelivr.net/npm/tailwindcss@2.2.16/dist/tailwind.min.css");
//         </style>
//     </head>

//     <body style="padding-left: 20px; padding-right: 20px;">
//         <div>
//             <p style="font-size: 12px; margin-left: 12px;">${dayjs(order.createdOn).format(
//               "M/D/YY, h:mm A"
//             )}</p>
//             <img style="width: 150px;" src="https://ehfakgf.stripocdn.email/content/guids/CABINET_e3dae694c00edbfc06ed9413cf7d63bf49202f8faad0a838d9a5196419c85338/images/logo.png" alt="Logo" />
//         </div>

//         <header>
//             <h1 style="font-size: 25px; font-weight: bold; text-align: center;">Designprint Order Confirmation # ${
//               order._id
//             }</h1>
//         </header>

//         <!-- Order Information -->
//         <section style="margin-top: 40px;">
//             <h2 style="font-weight: 500; margin-top: 12px; margin-bottom: 12px;">Order Information</h2>
//             <hr style="margin-top: 4px; margin-bottom: 4px; border-top: 2px solid black;" />
//             <div>
//                 <table style="width: 100%;">
//                     <tr>
//                         <td>
//                             <!-- Billing Address -->
//                             <div>
//                                 <h1 style="font-weight: bold; font-size: 14px;">BILLING ADDRESS</h1>
//                                 <p style="font-size: 14px;">
//                                     ${order.paymentDetails.billingAddress.firstName} ${
//     order.paymentDetails.billingAddress.lastName
//   }
//                                 </p>
//                                 <p style="font-size: 14px;">
//                                     ${order.paymentDetails.billingAddress.companyName}
//                                 </p>
//                                 <p style="font-size: 14px;">
//                                     ${order.paymentDetails.billingAddress.streetAddress}
//                                 </p>
//                                 <p style="font-size: 14px;">
//                                     ${order.paymentDetails.billingAddress.city}, ${
//     order.paymentDetails.billingAddress.state
//   }, ${order.paymentDetails.billingAddress.zipCode}
//                                 </p>

//                                 <p style="font-size: 14px;">
//                                     ${order.paymentDetails.billingAddress.country}
//                                 </p>

//                                 <p style="font-size: 14px;">
//                                     T:${order.paymentDetails.billingAddress.phoneNumber || " N/A"}
//                                 </p>
//                             </div>
//                         </td>
//                         <td>
//                             <!-- Payment Method -->
//                             <div>
//                                 <h1 style="font-weight: bold; font-size: 14px;">PAYMENT METHOD</h1>
//                                 <p>${
//                                   order.paymentDetails.paymentType === "credit-card"
//                                     ? "Credit Card"
//                                     : "Bank Account"
//                                 }</p>
//                                 <hr style="margin-top: 4px; margin-bottom: 4px; border-top: 1px solid black;" />
//                                 <div style="display: flex; justify-content: space-between;">
//                                     <h1 style="font-weight: bold;">Credit Card Type</h1>
//                                     ${order.paymentDetails.transactionResponse.accountType}
//                                 </div>
//                                 <hr style="margin-top: 4px; margin-bottom: 4px; border-top: 1px solid black;" />
//                                 <div style="display: flex; justify-content: space-between;">
//                                     <h1 style="font-weight: bold;">Credit Card Number</h1>
//                                     ${order.paymentDetails.transactionResponse.accountNumber}
//                                 </div>
//                             </div>
//                         </td>
//                     </tr>
//                 </table>
//             </div>
//         </section>

//         <section>
//             ${order?.cartItems
//               ?.map((cartItem) => {
//                 return `
//             <div style="margin-top: 40px;">
//                 <h1 style="font-weight: bold; font-size: 20px; margin-top: 12px; margin-bottom: 12px;">Project/P.O. #: ${
//                   cartItem.shipping.projectName
//                 }</h1>
//                 <hr style="margin-top: 4px; margin-bottom: 4px; border-top: 2px solid black;" />
//                 <div>
//                     <table style="width: 100%;">
//                         <tr>
//                             <td>
//                                 <table>
//                                     <h1 style="font-weight: bold;">PROJECT DETAILS</h1>
//                                     ${Object.keys(cartItem.product)
//                                       .map((productOptionKey) => {
//                                         return `
//                                     <tr style="display: flex; gap: 16px;">
//                                         <td style="color: black; font-weight: 500;">${productOptionKey}:</td>
//                                         <td>${cartItem.product[productOptionKey].value}</td>
//                                     </tr>
//                                     `;
//                                       })
//                                       .join("")}
//                                       ${Object.keys(cartItem.additionalPrices)
//                                         .map((productOptionKey) => {
//                                           return `
//                                     <tr style="display: flex; gap: 16px;">
//                                         <td style="color: black; font-weight: 500;">${productOptionKey}:</td>
//                                         <td>${cartItem.additionalPrices[productOptionKey].name} + $ ${cartItem.additionalPrices[productOptionKey].price}</td>
//                                     </tr>
//                                     `;
//                                         })
//                                         .join("")}
//                                 </table>
//                             </td>

//                             <td>
//                                 <div>
//                                     <h1 style="font-weight: 500; margin-bottom: 8px;">Project Cost</h1>
//                                     <hr style="margin-top: 4px; margin-bottom: 4px; border-top: 2px solid black;" />
//                                     <div style="display: flex; gap: 16px;">
//                                         <h1 style="color: black; font-weight: 500;">Set Price:</h1>
//                                         <h1>$ ${formatPrice(cartItem.shipping.setPrice)}</h1>
//                                     </div>
//                                     <div style="display: flex; gap: 16px;">
//                                         <h1 style="color: black; font-weight: 500;">Quantity:</h1>
//                                         <h1>${cartItem.shipping.quantity}</h1>
//                                     </div>
//                                 </div>
//                             </td>
//                         </tr>
//                     </table>
//                 </div>

//                 ${cartItem.shipping.shipments
//                   .map((shipment, shipmentIndex) => {
//                     return `
//                 <div>
//                     <h1 style="font-weight: 500; font-size: 16px; margin-top: 12px; margin-bottom: 12px;">Shipment ${
//                       shipmentIndex + 1
//                     }</h1>
//                     <hr style="margin-top: 4px; margin-bottom: 4px; border-top: 2px solid black;" />

//                     ${shipmentDetail(shipment)}
//                     <hr style="margin-top: 4px; margin-bottom: 4px; border-top: 3px solid black;" />

//                     ${shipment.sets
//                       .map((set) => {
//                         return `

//                     <section>
//                         <table style="width: 100%;">
//                             <tr>
//                                 <td>
//                                     <div>
//                                         <h1 style="font-weight: bold; text-align: center;">Set Name</h1>
//                                         <p>${set.name}</p>
//                                     </div>
//                                 </td>

//                                 <td>
//                                     <div>
//                                         <h1 style="font-weight: bold; text-align: center;">Job ID</h1>
//                                         <p style="text-align: center;">${set.jobId}</p>
//                                     </div>
//                                 </td>

//                                 <td>
//                                     <div>
//                                         <h1 style="font-weight: bold; text-align: center;">Job Status</h1>
//                                         <p style="text-align: center;">${set.status.statusTitle}</p>
//                                     </div>
//                                 </td>

//                                 <td>
//                                     <div>
//                                         <h1 style="font-weight: bold; text-align: center;">Cost Per Set</h1>
//                                         <p style="text-align: center;">$ ${formatPrice(
//                                           cartItem.shipping.setPrice
//                                         )}</p>
//                                     </div>
//                                 </td>
//                             </tr>
//                         </table>
//                     </section>

//                     `;
//                       })
//                       .join("")}
//                     <hr style="margin-top: 12px; border-top: 3px dashed black;" />
//                 </div>
//                 `;
//                   })
//                   .join("")}
//             </div>
//             `;
//               })
//               .join("")}
//         </section>

//         <section style="display: flex; justify-content: flex-end; flex-direction: column; align-items: flex-end; font-size: 20px;">
//             <div style="margin: 12px; border: 1px solid black; padding: 8px;">
//                 <table>
//                     <tr>
//                         <td>
//                             <h1 style="color: black; font-weight: 500;">Sub Total:</h1>
//                         </td>

//                         <td>
//                             <h1>$ ${formatPrice(order.cartTotal)}</h1>
//                         </td>
//                     </tr>
//                 </table>
//                 <table>
//                     <tr>
//                         <td>
//                             <h1 style="color: black; font-weight: 500;">Grand Total:</h1>
//                         </td>

//                         <td>
//                             <h1>$ ${formatPrice(order.grandTotal)}</h1>
//                         </td>
//                     </tr>
//                 </table>
//             </div>
//         </section>
//     </body>
// </html>
    
//     `;
// };

const sendOrderEmailTemplate = (order, settings) => {
    const brandColor = settings.primaryColor;
    const logoUrl = settings.apiUrl + settings.logo;
    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      try {
         return new Date(dateString).toLocaleString('en-US', {
           month: 'short', 
           day: 'numeric',
           year: 'numeric',
           hour: 'numeric',
           minute: '2-digit',
           hour12: true
         });
      } catch (e) {
          console.error("Error formatting date:", dateString, e);
          return 'Invalid Date';
      }
    };
  
    const formatPrice = (price) => {
      const numericPrice = Number(price);
      return isNaN(numericPrice) ? '0.00' : numericPrice.toFixed(2);
    };
  
    const generateSetDetails = (set, cartItem) => {
     
      const costPerSet = cartItem?.shipping?.setPrice|| 0; 
  
      return `
        <tr>
          <td style="padding: 8px 10px; border-bottom: 1px solid #dee2e6; font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #333333; text-align: left; word-break: break-word;">${set?.name || 'N/A'}</td>
          <td style="padding: 8px 10px; border-bottom: 1px solid #dee2e6; font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #333333; text-align: center;">${set?.jobId || 'N/A'}</td>
          <td style="padding: 8px 10px; border-bottom: 1px solid #dee2e6; font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #333333; text-align: center;">${set?.status?.statusTitle || 'N/A'}</td>
          <td style="padding: 8px 10px; border-bottom: 1px solid #dee2e6; font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #333333; text-align: right; white-space: nowrap;">$${formatPrice(costPerSet)}</td>
        </tr>
      `;
    };
  
    // Main email template
    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
    <style>
      /* Basic Reset & Font */
      body { margin: 0; padding: 0; background-color: #f8f9fa; font-family: Arial, Helvetica, sans-serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
      table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
      td { vertical-align: top; }
      img { display: block; max-width: 100%; height: auto; border: 0; -ms-interpolation-mode: bicubic;}
      a { color:${brandColor}; text-decoration: none; }
      p { margin: 0; padding: 0; }
      h1, h2 { margin: 0; padding: 0; font-weight: bold; }
  
      /* Structure & Spacing */
      .content-table { width: 100%; max-width: 650px; background-color: #ffffff; margin: 0 auto; border: 0;}
      .section-padding { padding: 15px 25px; }
      .section-padding-tight { padding: 10px 25px; } /* For less vertical space */
      .section-padding-xtight { padding: 5px 25px; } /* For even less vertical space */
      .hr-dark { border: 0; border-top: 1px solid #dee2e6; margin: 10px 0; }
      .hr-light { border: 0; border-top: 1px solid #dddddd; margin: 5px 0; }
  
      /* Typography & Colors */
      .detail-text { font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #333333; line-height: 1.6; }
      .bold-text { font-weight: bold; color: #000000; }
      .green-text { color:#449299; }
      .grey-text { color: #6c757d; }
      .footer-text { font-size: 12px; color: #6c757d; text-align: center; line-height: 1.5; }
      .heading1 { font-family: Arial, Helvetica, sans-serif; font-size: 28px; color:${brandColor}; margin-bottom: 15px; font-weight: bold; }
      .heading2 { font-family: Arial, Helvetica, sans-serif; font-size: 18px; color: #ffffff; font-weight: bold; }
      .heading3 { font-size: 14px; margin-bottom: 8px; font-weight: bold; color: #000000; } /* Replaces p.bold-text for headings */
  
      /* Cost Tables */
      .cost-table { width: 100%; /* Takes width of container column by default */ }
      .cost-label { padding: 5px 5px 5px 0; text-align: left; }
      .cost-value { padding: 5px 0 5px 5px; text-align: right; white-space: nowrap; }
      .total-row { background-color: #e9ecef; font-weight: bold;}
      .total-row td { padding: 8px 5px; }
  
      /* Bullets */
      .bullet { color: #f39c12; margin-right: 5px; display: inline-block; width: 10px; } /* Adjust width as needed */
  
      /* Responsive Styles */
      @media only screen and (max-width: 600px) {
        body { width: 100% !important; min-width: 100% !important; }
        .content-table { width: 100% !important; max-width: 100% !important; }
        .section-padding { padding: 15px 15px !important; }
        .section-padding-tight { padding: 10px 15px !important; }
        .section-padding-xtight { padding: 5px 15px !important; }
  
        /* Two Column Stacking */
        .two-column { width: 100% !important; }
        .two-column td { display: block !important; width: 100% !important; box-sizing: border-box !important; padding-left: 0 !important; padding-right: 0 !important; }
        .two-column td:first-child { margin-bottom: 15px !important; }
        .two-column .column-spacer { display: none !important; } /* Hide desktop spacers */
  
        /* Make all cost tables full width on mobile */
        .cost-table-container { width: 100% !important; } /* Ensure container takes full width */
        .cost-table { width: 100% !important; } /* Ensure table itself takes full width */
  
        .logo { width: 150px !important; height: auto !important; } /* Adjust logo size on mobile */
        .heading1 { font-size: 24px !important; }
        .heading2 { font-size: 16px !important; }
        .footer-text { font-size: 11px !important; }
        .cost-value { white-space: normal !important; } /* Allow price wrapping if needed */
      }
    </style>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: Arial, Helvetica, sans-serif;">
    <center>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8f9fa;">
        <tr>
          <td align="center" style="padding: 20px 0;">
            <!-- Main Content Table -->
            <table role="presentation" class="content-table" cellpadding="0" cellspacing="0" border="0">
              <!-- Logo -->
              <tr>
                <td class="section-padding">
                  <img src="${logoUrl}" alt="Company Logo" width="180" class="logo" style="width: 180px; height: auto;" />
                </td>
              </tr>
              <!-- Order Confirmation Title & Intro -->
              <tr>
                <td class="section-padding">
                  <h1 class="heading1">Order Confirmation</h1>
                  <p class="detail-text bold-text" style="margin-bottom: 15px;">
                    ${order?.paymentDetails?.billingAddress?.firstName || 'Dear Valued Customer'}, <!-- DYNAMIC CUSTOMER NAME -->
                  </p>
                  <p class="detail-text" style="margin-bottom: 10px;">
                    Thank you for your order from ${settings.storeName}. Once your package ships we will send you a tracking number. You can check the status of your order by <a href="${settings.storeURL}/login" class="green-text">logging into your account</a>.
                  </p>
                  <p class="detail-text">
                    If you have questions about your order, you can email us at <a href="mailto:${settings.email}" class="green-text">${settings.email}</a>.
                  </p>
                </td>
              </tr>
              <!-- Order Number -->
              <tr>
                <td class="section-padding-xtight"> <!-- Less padding -->
                   <p class="detail-text">
                     <strong class="bold-text">Order No:</strong><strong class="bold-text"> ${order?._id || 'N/A'}</strong>
                   </p>
                </td>
              </tr>
              <!-- Separator -->
               <tr>
                 <td style="padding: 0 25px;"> <hr class="hr-dark"> </td>
               </tr>
              <!-- Placed On & Billing/Payment Info -->
              <tr>
                 <td class="section-padding-tight"> <!-- Less padding -->
                    <p class="detail-text" style="margin-bottom: 15px;">
                      Placed on ${formatDate(order?.createdOn)}
                    </p>
                    <!-- Billing & Payment Two Column Layout -->
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" class="two-column">
                       <tr>
                          <!-- Billing Info Column -->
                          <td width="50%" style="padding-right: 15px;" class="detail-text">
                             <h3 class="heading3">Billing Info</h3>
                             <p>${order?.paymentDetails?.billingAddress?.firstName || ''} ${order?.paymentDetails?.billingAddress?.lastName || ''}</p>
                             ${order?.paymentDetails?.billingAddress?.companyName ? `<p>${order.paymentDetails.billingAddress.companyName}</p>` : ''}
                             <p>${order?.paymentDetails?.billingAddress?.streetAddress || ''}</p>
                             <p>${order?.paymentDetails?.billingAddress?.city || ''}, ${order?.paymentDetails?.billingAddress?.state || ''}, ${order?.paymentDetails?.billingAddress?.zipCode || ''}</p>
                             <p>${order?.paymentDetails?.billingAddress?.country || ''}</p>
                             <p>T: ${order?.paymentDetails?.billingAddress?.phoneNumber || 'N/A'}</p>
                          </td>
                          <!-- Desktop Spacer -->
                          <td width="30" class="column-spacer" style="width: 30px; min-width: 30px; max-width: 30px;"> </td>
                          <!-- Payment Method Column -->
                          <td width="45%" style="padding-left: 0px;" class="detail-text"> <!-- Adjusted width slightly -->
                             <h3 class="heading3">Payment Method</h3>
                             <p>${order?.paymentDetails?.paymentType === "credit-card" ? "Credit Card" : (order?.paymentDetails?.paymentType || "N/A")}</p>
                             <p>Card Type: ${order?.paymentDetails?.transactionResponse?.accountType || 'N/A'}</p>
                             <p>Card Number: ${order?.paymentDetails?.transactionResponse?.accountNumber || 'N/A'}</p>
                          </td>
                       </tr>
                    </table>
                 </td>
              </tr>
  
              <!-- Project Information Loop Start -->
              ${(order?.cartItems || []).map((cartItem, index) => {
                const projectCost = {
                  subtotal: cartItem?.total|| 0,
                  shipping: cartItem?.projectShipping || 0.00,
                  handling:  0.00,
                  tax:  0.00,
                  grandTotal: cartItem?.grandTotal || 0.00
                };
                if (projectCost.grandTotal === 0.00 && (projectCost.subtotal > 0 || projectCost.shipping > 0 || projectCost.handling > 0 || projectCost.tax > 0)) {
                   projectCost.grandTotal = projectCost.subtotal + projectCost.shipping + projectCost.handling + projectCost.tax;
                }
  
                return `
                <tr>
                  <td style="padding: 25px 0 0 0;"> <!-- Top padding before each project -->
                    <!-- Project Header -->
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td style="background-color:#449299; padding: 10px 25px;">
                          <h2 class="heading2">
                            Project/P.O. #: ${cartItem?.shipping?.projectName || `Project ${index + 1}`}
                          </h2>
                        </td>
                      </tr>
                    </table>
                    <!-- Project Details & Cost -->
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8f9fa;">
                      <tr>
                        <td class="section-padding">
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" class="two-column">
                            <tr>
                              <!-- Project Details Column -->
                              <td width="58%" style="padding-right: 15px;" class="detail-text"> <!-- Adjusted width slightly -->
                                 <!-- DYNAMIC Product Details START -->
                                 ${cartItem?.product && Object.keys(cartItem.product).length > 0 ? `
                                   <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                      ${Object.keys(cartItem.product).map(key => {
                                          const formattedKey = key.replace(/([A-Z]+)/g, ' $1').replace(/([A-Z][a-z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
                                          const value = cartItem.product[key]?.value !== undefined ? cartItem.product[key].value : cartItem.product[key];
                                          const showBullet = ['sku', 'flutedirections', 'flute direction'].includes(key.toLowerCase().replace(/\s+/g, '')); // More robust key check
                                          const isBooleanYesNo = typeof value === 'boolean' || (typeof value === 'string' && (value.toLowerCase() === 'yes' || value.toLowerCase() === 'no'));
  
                                          return `
                                          <tr>
                                              <td style="padding-bottom: ${isBooleanYesNo ? '0' : '5px'};" class="detail-text">
                                                  ${showBullet ? '<span class="bullet">■</span>' : ''}
                                                  <strong class="bold-text">${formattedKey}:</strong> ${isBooleanYesNo ? '' : (value || 'N/A')}
                                              </td>
                                              ${isBooleanYesNo ? `<td style="padding-left: 5px; padding-bottom: 5px;" class="detail-text">${value === true || (typeof value === 'string' && value.toLowerCase() === 'yes') ? 'Yes' : 'No'}</td>` : ''}
                                          </tr>
                                          `;
                                      }).join('')}
                                   </table>
                                 ` : '<p class="detail-text">No product details available.</p>'}
                                 <!-- DYNAMIC Product Details END -->
  
                                 <!-- DYNAMIC Additional Prices START -->
                                 ${cartItem?.additionalPrices && Object.keys(cartItem.additionalPrices).length > 0 ? `
                                   <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 10px;">
                                      ${Object.keys(cartItem.additionalPrices).map(key => {
                                          const formattedKey = key.replace(/([A-Z]+)/g, ' $1').replace(/([A-Z][a-z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
                                          const addon = cartItem.additionalPrices[key];
                                          return `
                                          <tr>
                                              <td style="padding-bottom: 5px;" class="detail-text">
                                                  <strong class="bold-text">${formattedKey}:</strong> ${addon?.name || 'N/A'} ${addon?.price ? `+ $${formatPrice(addon.price)}` : ''}
                                              </td>
                                          </tr>
                                          `;
                                      }).join('')}
                                   </table>
                                 ` : ''}
                                 <!-- DYNAMIC Additional Prices END -->
  
                                 <!-- Turnaround Time (if available separately) -->
                                 ${cartItem?.turnaroundTime ? `
                                  <p class="detail-text" style="margin-top: 10px;"><strong class="bold-text">Turnaround Time:</strong> ${cartItem.turnaroundTime}</p>
                                 ` : ''}
  
                              </td>
                              <!-- Desktop Spacer -->
                              <td width="30" class="column-spacer" style="width: 30px; min-width: 30px; max-width: 30px;"> </td>
                              <!-- Project Cost Column -->
                              <td width="40%" style="padding-left: 0px;" class="detail-text cost-table-container"> <!-- Added container class -->
                                <h3 class="heading3">Project Cost</h3>
                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" class="cost-table"> <!-- Ensure width=100% here -->
                                  <tr>
                                    <td class="cost-label">Subtotal</td>
                                    <td class="cost-value">$${formatPrice(projectCost.subtotal)}</td>
                                  </tr>
                                  <tr>
                                    <td class="cost-label">Shipping & Processing</td>
                                    <td class="cost-value">$${formatPrice(projectCost.shipping)}</td>
                                  </tr>
                                  <tr> <td colspan="2"> <hr class="hr-light"> </td> </tr>
                                  <tr>
                                    <td class="cost-label">Handling Fee</td>
                                    <td class="cost-value">$${formatPrice(projectCost.handling)}</td>
                                  </tr>
                                  <tr>
                                    <td class="cost-label">Tax</td>
                                    <td class="cost-value">$${formatPrice(projectCost.tax)}</td>
                                  </tr>
                                  <tr> <td colspan="2"> <hr class="hr-light"> </td> </tr>
                                  <tr class="total-row">
                                    <td>Total</td>
                                    <td align="right">$${formatPrice(projectCost.grandTotal)}</td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
  
                    <!-- Shipments within Project -->
                    ${(cartItem?.shipping?.shipments || []).map((shipment, shipmentIndex) => {
                        // --- Define shipment-level costs ---
                        const shipmentCost = {
                           subtotal: cartItem?.shipping?.setPrice || 0.0,
                           shipping: Number( shipment?.shippingMethod?.TotalCharges?.MonetaryValue || 0.00), // Ensure number
                           handling: shipment?.handlingFee || 0.0,
                           tax: shipment?.tax || 0.0,
                           grandTotal: shipment?.grandTotal || 0.00
                        };
                        if (shipmentCost.grandTotal === 0.00 && (shipmentCost.subtotal > 0 || shipmentCost.shipping > 0 || shipmentCost.handling > 0 || shipmentCost.tax > 0)) {
                           shipmentCost.grandTotal = shipmentCost.subtotal + shipmentCost.shipping + shipmentCost.handling + shipmentCost.tax;
                        }
                        // --- END Shipment Cost Definitions ---
                        const isPickup = shipment?.shippingType === "pickup";
                        const address = isPickup ? shipment?.pickupAddress : shipment?.shippingAddress;
  
                       return `
                       <!-- Shipment Header -->
                       <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 20px;">
                          <tr>
                             <td style="background-color: ${brandColor}; padding: 10px 25px;">
                             <h2 class="heading2">
                                Shipment ${shipmentIndex + 1} ${isPickup ? '(Pickup)' : ''}
                             </h2>
                             </td>
                          </tr>
                       </table>
                       <!-- Shipment Details & Cost -->
                       <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8f9fa;">
                         <tr>
                           <td class="section-padding">
                             <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" class="two-column">
                               <tr>
                                 <!-- Ship To / Pickup / In Hand / Method Column -->
                                 <td width="58%" style="padding-right: 15px;" class="detail-text"> <!-- Adjusted width slightly -->
                                   <h3 class="heading3">${isPickup ? 'Pickup Address' : 'Ship to'}</h3>
                                   ${!isPickup ? `
                                       <p>${address?.firstName || ''} ${address?.lastName || ''}</p>
                                       ${address?.companyName ? `<p>${address.companyName}</p>` : ''}
                                       <p>${address?.streetAddress || ''}</p>
                                       <p>${address?.city || ''}, ${address?.state || ''}, ${address?.zipCode || ''}</p>
                                       <p style="margin-bottom: 10px;">${address?.country || ''}</p>
                                       <p style="margin-bottom: 15px;">T: ${address?.phoneNumber || 'N/A'}</p>
                                   ` : `
                                       <p>${address?.street || ''}</p>
                                       <p>${address?.city || ''}</p>
                                       <p style="margin-bottom: 10px;">${address?.state || ''}</p>
                                       <p style="margin-bottom: 15px;"> </p> <!-- Placeholder -->
                                   `}
  
                                   <p><strong class="bold-text">In Hand:</strong> ${shipment?.shippingDates?.deliveryDate || 'N/A'}</p>
                                   ${!isPickup ? `
                                      <p style="margin-top: 10px;"><strong class="bold-text">Shipping method</strong></p>
                                      <p>${upsServiceCodes[shipment?.shippingMethod?.Service?.Code] || 'Not Applicable'}</p>
                                   ` : ''}
  
                                 </td>
                                 <!-- Desktop Spacer -->
                                 <td width="30" class="column-spacer" style="width: 30px; min-width: 30px; max-width: 30px;"> </td>
                                 <!-- Shipment Cost Column -->
                                 <td width="40%" style="padding-left: 0px;" class="detail-text cost-table-container"> <!-- Added container class -->
                                   <h3 class="heading3">Project Cost</h3> <!-- Label matches design -->
                                   <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" class="cost-table"> <!-- Ensure width=100% here -->
                                     <tr>
                                       <td class="cost-label">Subtotal</td>
                                       <td class="cost-value">$${formatPrice(shipmentCost.subtotal)}</td>
                                     </tr>
                                     <tr>
                                       <td class="cost-label">Shipping & Processing</td>
                                       <td class="cost-value">$${formatPrice(shipmentCost.shipping)}</td>
                                     </tr>
                                      <tr> <td colspan="2"> <hr class="hr-light"> </td> </tr>
                                     <tr>
                                       <td class="cost-label">Handling Fee</td>
                                       <td class="cost-value">$${formatPrice(shipmentCost.handling)}</td>
                                     </tr>
                                     <tr>
                                       <td class="cost-label">Tax</td>
                                       <td class="cost-value">$${formatPrice(shipmentCost.tax)}</td>
                                     </tr>
                                     <tr> <td colspan="2"> <hr class="hr-light"> </td> </tr>
                                     <tr class="total-row">
                                       <td>Total</td>
                                       <td align="right">$${formatPrice(shipmentCost.grandTotal)}</td>
                                     </tr>
                                   </table>
                                 </td>
                               </tr>
                             </table>
                           </td>
                         </tr>
                       </table>
  
                        <!-- Sets Table -->
                         <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                           <tr>
                             <td class="section-padding" style="padding-top: 0;"> <!-- Padding applied to container cell -->
                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                  <thead>
                                    <tr style="background-color: #e9ecef;">
                                      <th style="padding: 8px 10px; font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #333333; font-weight: bold; text-align: left; border-bottom: 1px solid #dee2e6;">Set Name</th>
                                      <th style="padding: 8px 10px; font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #333333; font-weight: bold; text-align: center; border-bottom: 1px solid #dee2e6;">Job ID</th>
                                      <th style="padding: 8px 10px; font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #333333; font-weight: bold; text-align: center; border-bottom: 1px solid #dee2e6;">Job Status</th>
                                      <th style="padding: 8px 10px; font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #333333; font-weight: bold; text-align: right; border-bottom: 1px solid #dee2e6;">Cost Per Set</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    ${(shipment?.sets || []).map(set => generateSetDetails(set, cartItem)).join('')}
                                    ${(shipment?.sets || []).length === 0 ? '<tr><td colspan="4" style="padding: 10px; text-align: center;" class="detail-text grey-text">No sets in this shipment.</td></tr>' : ''}
                                  </tbody>
                                </table>
                             </td>
                           </tr>
                         </table>
                       `;
                    }).join('')}
                  </td>
                </tr>
                `;
              }).join('')}
              <!-- Project Information Loop End -->
  
              <!-- Final Order Totals Summary -->
              <tr>
                <td align="right" class="section-padding" style="padding-top: 25px;">
                   <div style="display: inline-block; width: 100%; max-width: 280px;"> <!-- Wrapper for alignment and mobile width -->
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" class="cost-table-container detail-text"> <!-- Added container class -->
                        <tr>
                            <td class="cost-label">Subtotal</td>
                            <td class="cost-value">$${formatPrice(order?.cartTotal || 0)}</td>
                        </tr>
                        <!-- These fields are not used, because they are not required -->
                        <!--
                        <tr>
                            <td class="cost-label">Handling Fee</td>
                            <td class="cost-value">$${formatPrice(order?.handlingFee || 0)}</td>
                        </tr>
                        <tr>
                            <td class="cost-label">Shipping & Handling</td>
                            <td class="cost-value">$${formatPrice(order?.shippingMethod?.TotalCharges.MonetaryValue || 0)}</td>
                        </tr>
                       -->
                        <tr> <td colspan="2"> <hr class="hr-light"> </td> </tr>
                        <tr class="total-row">
                            <td>Grand Total</td>
                            <td align="right">$${formatPrice(order?.grandTotal || 0)}</td>
                        </tr>
                      </table>
                   </div>
                </td>
              </tr>
  
              <!-- Footer Separator -->
               <tr>
                 <td style="padding: 25px 25px 0 25px;"> <hr class="hr-dark"> </td>
               </tr>
              <!-- Footer -->
              <tr>
                <td class="section-padding">
                  <p class="footer-text" style="margin-bottom: 5px;">
                    ${settings.phoneNumber}   |   Mon - Fri: 9am - 5pm ET
                  </p>
                  <p class="footer-text">
                    ${settings.storeName} | ${settings.address}
                  </p>
                </td>
              </tr>
            </table>
            <!-- End Main Content Table -->
          </td>
        </tr>
      </table>
    </center>
  </body>
  </html>
    `;
  };
  
// const sendEmailToIndividualUserTempate = (body) => {
//   return `
//   <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
// </head>
// <body>

//     <div>
//         ${body}
//     </div>
    
// </body>
// </html>`;
// };

// const sendNotificationOfOrderModifications = (message) => {
//   return `
//     <!DOCTYPE html>
//   <html lang="en">
//   <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   </head>
//   <body>
  
//       <div>
//           ${message}
//       </div>
      
//   </body>
//   </html>`;
// };

const sendNotificationOfOrderModifications = (notificationData, settings) => {

  const customerName = `${notificationData?.userId?.firstName || ''} ${notificationData?.userId?.lastName || ''}`.trim() || 'Valued Customer';
const apiUrl = settings.apiUrl;
  const logoUrl = apiUrl + settings.logo;
  const companyWebsite = settings.storeURL;
  const loginUrl = `${companyWebsite}/login`; 
  const companyEmail = settings.email;
  const companyPhone = settings.phoneNumber;
  const companyAddress = settings.address;
  const brandColor = settings.brandColor;
  const companyName = settings.storeName;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You Have New Messages - ${companyName}</title>
  <style>
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #f8f9fa; font-family: Arial, Helvetica, sans-serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table { border-collapse: collapse !important; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    td { vertical-align: top; text-align: left; }
    img { display: block; max-width: 100%; height: auto; border: 0; -ms-interpolation-mode: bicubic;}
    a { color: ${brandColor}; text-decoration: none; }
    p { margin: 0; padding: 0; }
    h1, h2, h3, h4, h5, h6 { margin: 0 0 0.75em 0; padding: 0; font-weight: bold; }
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
    div[style*="margin: 16px 0;"] { margin: 0 !important; }
    .main-content p {
        margin: 0 0 1em 0;
        padding: 0;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 14px;
        line-height: 1.6;
        color: #333333;
    }
    .main-content p.greeting { margin-bottom: 16px; }
    .main-content p.closing { margin-top: 20px; }
    .email-subject-heading {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 24px;
        color: ${brandColor};
        margin: 0 0 20px 0;
        font-weight: bold;
        padding: 0;
    }
    .footer-text {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 12px;
        color: #6c757d;
        text-align: center;
        line-height: 1.5;
        margin-bottom: 5px;
    }
    hr.separator {
        border: 0;
        border-top: 1px solid #dee2e6;
        margin: 10px 0;
    }
    .section-padding {
        padding: 15px 25px;
    }
    .main-content-padding {
        padding: 25px 40px;
    }
    .button-td {
        border-radius: 4px;
        background-color: ${brandColor};
    }
    .button-a {
        display: inline-block;
        padding: 12px 25px;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 16px;
        font-weight: bold;
        color: #ffffff; 
        text-decoration: none;
        border-radius: 4px;
    }
    .button-td:hover, .button-a:hover { /* Basic hover effect */
        background-color:${brandColor} !important; /* Slightly darker brand color */
    }

    @media only screen and (max-width: 600px) {
      body { width: 100% !important; min-width: 100% !important; }
      .content-table { width: 100% !important; max-width: 100% !important; }
      .section-padding { padding: 15px 15px !important; }
      .main-content-padding { padding: 20px 15px !important; }
      .logo { width: 150px !important; height: auto !important; }
      .email-subject-heading { font-size: 22px !important; margin-bottom: 15px !important; }
      .footer-text { font-size: 11px !important; }
      .button-a { padding: 10px 20px !important; font-size: 15px !important;} /* Adjust button padding/size */
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: Arial, Helvetica, sans-serif;">
  <center>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8f9fa;">
      <tr>
        <td align="center" style="padding: 20px 0;">
          <table role="presentation" class="content-table" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width: 650px; background-color: #ffffff; margin: 0 auto; border: 0;">
            <tr>
              <td class="section-padding">
                <img src="${logoUrl}" alt="${companyName} Logo" width="180" class="logo" style="width: 180px; height: auto;" />
              </td>
            </tr>

            <tr>
              <td class="main-content-padding main-content">
                <h2 class="email-subject-heading">
                    You Have New Messages
                </h2>

                <p class="greeting">
                  <strong style="color: #000000;">Hello Dear ${customerName},</strong>
                </p>
                <p>
                  You have received new messages in your account portal regarding your recent orders with ${companyName}.
                </p>
                <p>
                  Please log in to your account to view the messages.
                </p>

                <!-- Login Button -->
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin-top: 20px; margin-bottom: 20px;" align="left">
                    <tr>
                        <td align="center" class="button-td">
                            <a href="${loginUrl}" target="_blank" class="button-a">
                                Log In to Check Messages
                            </a>
                        </td>
                    </tr>
                </table>
                 <div style="clear: both; height: 1px; line-height: 1px;"> </div>

                <p style="margin-top: 20px;">
                  If you require any assistance or have trouble logging in, please contact our support team at
                  <a href="mailto:${companyEmail}" style="color: ${brandColor}; text-decoration: underline;">${companyEmail}</a>.
                </p>
                <p class="closing">
                  Best regards,<br/>The ${companyName} Team
                 </p>
              </td>
            </tr>

            <tr>
              <td style="padding: 10px 40px 0 40px;">
                <hr class="separator" />
              </td>
            </tr>

            <tr>
               <td class="section-padding" style="padding: 15px 25px;">
                 <p class="footer-text">
                    ${companyAddress}
                  </p>
                 <p class="footer-text">
                    Tel: ${companyPhone} | Email: <a href="mailto:${companyEmail}" style="color: ${brandColor}; text-decoration: none;">${companyEmail}</a>
                  </p>
                 <p class="footer-text" style="margin-bottom: 0;">
                    <a href="${companyWebsite}" target="_blank" style="color: ${brandColor}; text-decoration: none;">${companyWebsite}</a>
                 </p>
               </td>
            </tr>

          </table>
        </td>
      </tr>
        <tr>
            <td align="center" style="padding: 24px 20px;">
                 <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 650px;">
                   
                </table>
            </td>
        </tr>
    </table>
  </center>
</body>
</html>
`;
};



const sendQuoteEmailTemplate = (quoteData, settings) => {
  const customerName = `${quoteData.firstName || ''} ${quoteData.lastName || ''}`.trim() || 'Valued Customer';
  const quoteTitle = quoteData?.title || 'Your Quote';
  const quoteId = quoteData?.id; 
  const product = quoteData?.product || {};
  const additionalDetails = quoteData?.additionalDetails;
  const hasAdditionalDetails = additionalDetails && additionalDetails.length > 0 && additionalDetails.toLowerCase() !== "nill" && additionalDetails.toLowerCase() !== "no msg";

  const formattedAdditionalDetails = hasAdditionalDetails
      ? additionalDetails.replace(/\n/g, '<br />')
      : 'If you have any questions, please don\'t hesitate to contact us.';
const apiUrl = settings.apiUrl;
  const logoUrl = apiUrl + settings.logo;
  const companyWebsite = settings.storeURL; 
  const companyEmail = settings.email;
  const companyPhone = settings.phoneNumber; 
  const companyAddress = settings.address; 
  const brandColor = settings.primaryColor; 

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${quoteTitle}</title>
  <style>
    /* Basic Reset & Font - Copied from reference */
    body { margin: 0; padding: 0; background-color: #f8f9fa; font-family: Arial, Helvetica, sans-serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    td { vertical-align: top; }
    img { display: block; max-width: 100%; height: auto; border: 0; -ms-interpolation-mode: bicubic;}
    a { color: ${brandColor}; text-decoration: none; } /* Using Brand Color */
    p { margin: 0; padding: 0; }
    h1, h2 { margin: 0; padding: 0; font-weight: bold; }
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
    div[style*="margin: 16px 0;"] { margin: 0 !important; }

    /* Responsive Styles - Copied from reference */
    @media only screen and (max-width: 600px) {
      body { width: 100% !important; min-width: 100% !important; }
      .content-table { width: 100% !important; max-width: 100% !important; }
      .section-padding { padding: 15px 15px !important; }
      .section-padding-tight { padding: 10px 15px !important; }
      .section-padding-xtight { padding: 5px 15px !important; }
      .logo { width: 150px !important; height: auto !important; }
      .heading1 { font-size: 24px !important; }
      .heading2 { font-size: 20px !important; } /* Adjusted heading2 size */
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: Arial, Helvetica, sans-serif;">
  <center>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8f9fa;">
      <tr>
        <td align="center" style="padding: 20px 0;">
          <!-- Main Content Table -->
          <table role="presentation" class="content-table" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width: 650px; background-color: #ffffff; margin: 0 auto; border: 0;">
            <!-- Logo -->
            <tr>
              <td class="section-padding" style="padding: 15px 25px;">
                <img src="${logoUrl}" alt="Company Logo" width="180" class="logo" style="width: 180px; height: auto;" />
              </td>
            </tr>
            <!-- Content Area -->
            <tr>
              <td class="section-padding" style="padding: 15px 25px;">
                <!-- Heading -->
                <h1 class="heading1" style="font-family: Arial, Helvetica, sans-serif; font-size: 28px; color: ${brandColor}; margin-bottom: 15px; font-weight: bold;">
                  Your Custom Quote
                </h1>

                <!-- Greeting -->
                <p style="font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #333333; line-height: 1.6; margin-bottom: 16px;">
                  <strong style="font-weight: bold; color: #000000;">Dear ${customerName},</strong>
                </p>

                <!-- Intro Text -->
                <p style="font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #333333; line-height: 1.6; margin-bottom: 20px;">
                  Thank you for your interest! Please find the details for your custom quote request below.
                </p>

                <!-- Quote Meta Details -->
                ${quoteId ? `
                <p style="font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #333333; line-height: 1.6; margin-bottom: 4px;">
                  <strong style="font-weight: bold; color: #000000;">Quote Ref:</strong> ${quoteId}
                </p>` : ''}
                <p style="font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #333333; line-height: 1.6; margin-bottom: 20px;">
                  <strong style="font-weight: bold; color: #000000;">Subject:</strong> ${quoteTitle}
                </p>

                <!-- Product Details Section -->
                <h2 class="heading2" style="font-family: Arial, Helvetica, sans-serif; font-size: 22px; color: ${brandColor}; margin-bottom: 10px; font-weight: bold;">
                  Product Details
                </h2>
                <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #eeeeee; border-radius: 4px; background-color: #f8f9fa; font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #333333; line-height: 1.6;">
                  <p style="margin-bottom: 5px;"><strong style="color: #555555;">Product:</strong> ${product.pName || 'N/A'}</p>
                  <p style="margin-bottom: 5px;"><strong style="color: #555555;">Quantity:</strong> ${product.pQuantity || 'N/A'}</p>
                  ${product.pCoating ? `<p style="margin-bottom: 5px;"><strong style="color: #555555;">Coating:</strong> ${product.pCoating}</p>` : ''}
                  ${product.pLamination ? `<p style="margin-bottom: 5px;"><strong style="color: #555555;">Lamination:</strong> ${product.pLamination}</p>` : ''}
                  ${product.pPaper_Stock ? `<p style="margin-bottom: 5px;"><strong style="color: #555555;">Paper Stock:</strong> ${product.pPaper_Stock}</p>` : ''}
                  ${product.pSides_Pages ? `<p style="margin-bottom: 5px;"><strong style="color: #555555;">Sides/Pages:</strong> ${product.pSides_Pages}</p>` : ''}
                  ${product.pAdditional_Details && product.pAdditional_Details.toLowerCase() !== 'nill' ? `
                  <p style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #dddddd;">
                  </p>` : ''}
                </div>

                <!-- Additional Details Section -->
                <h2 class="heading2" style="font-family: Arial, Helvetica, sans-serif; font-size: 22px; color: ${brandColor}; margin-bottom: 10px; font-weight: bold;">
                  Additional Information
                </h2>
                <p style="font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #333333; line-height: 1.6; margin-bottom: 24px;">
                  ${formattedAdditionalDetails}
                </p>

                <!-- Regards -->
                <p style="font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #333333; line-height: 1.6; margin-bottom: 4px;">
                  Regards,
                </p>
                <p style="font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #333333; line-height: 1.6; margin-bottom: 24px;">
                  Customer Care
                </p>

                <!-- Footer Separator -->
                <hr style="border: 0; border-top: 1px solid #dee2e6; margin: 10px 0;">

                <!-- Footer Address Block -->
                 <p style="font-family: Arial, Helvetica, sans-serif; font-size: 12px; color: #6c757d; text-align: center; line-height: 1.5; margin-bottom: 5px;">
                    ${companyAddress}
                  </p>
                 <p style="font-family: Arial, Helvetica, sans-serif; font-size: 12px; color: #6c757d; text-align: center; line-height: 1.5; margin-bottom: 5px;">
                    Tel: ${companyPhone} | Email: <a href="mailto:${companyEmail}" style="color: ${brandColor}; text-decoration: none;">${companyEmail}</a>
                  </p>
                 <p style="font-family: Arial, Helvetica, sans-serif; font-size: 12px; color: #6c757d; text-align: center; line-height: 1.5;">
                    <a href="${companyWebsite}" target="_blank" style="color: ${brandColor}; text-decoration: none;">${companyWebsite}</a>
                 </p>

              </td>
            </tr>
            <!-- End Content Area -->
          </table>
          <!-- End Main Content Table -->
        </td>
      </tr>
       <!-- Footer Context -->
        <tr>
            <td align="center" style="padding: 24px 20px;">
                 <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 650px;">
                    <tr>
                        <td align="center" style="padding: 0; font-family: Arial, Helvetica, sans-serif; font-size: 12px; line-height: 18px; color: #6c757d;">
                            <p style="margin: 0;">You are receiving this email in response to your custom quote request from ${settings.storeName}.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <!-- End Footer Context -->
    </table>
  </center>
</body>
</html>
`;
};


const sendCustomOrderRequestEmail = (requestData, settings) => {
  const customerName = `${requestData.firstName || ''} ${requestData.lastName || ''}`.trim() || 'Valued Customer';
  const customerEmail = requestData.email;
  const customerPhone = requestData.phoneNumber;
  const requestDetails = requestData.details;
  const attachmentURL = requestData.attachmentURL; 
  const requestId = requestData.id;
  const requestDate = requestData.createdAt;

  const formattedDetails = requestDetails ? requestDetails.replace(/\n/g, '<br />') : 'No details provided.';

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      console.error("Error formatting date:", dateString, e);
      return 'Invalid Date';
    }
  };
  const formattedRequestDate = formatDate(requestDate);
  const fullAttachmentLink = attachmentURL ? `${settings.apiUrl || ''}${attachmentURL}` : null;


  const apiUrl = settings.apiUrl;
  const logoUrl = apiUrl + settings.logo; // Your actual logo URL
  const companyWebsite = settings.storeURL; 
  const companyEmail = settings.email;
  const companyPhone = settings.phoneNumber; 
  const companyAddress = settings.address; 
  const brandColor = settings.primaryColor; 

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Custom Order Request Received</title>
  <style>
    /* Basic Reset & Font - Copied from reference */
    body { margin: 0; padding: 0; background-color: #f8f9fa; font-family: Arial, Helvetica, sans-serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    td { vertical-align: top; }
    img { display: block; max-width: 100%; height: auto; border: 0; -ms-interpolation-mode: bicubic;}
    a { color: ${brandColor}; text-decoration: none; }
    p { margin: 0; padding: 0; }
    h1, h2 { margin: 0; padding: 0; font-weight: bold; }
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
    div[style*="margin: 16px 0;"] { margin: 0 !important; }

    /* Responsive Styles - Copied from reference */
    @media only screen and (max-width: 600px) {
      body { width: 100% !important; min-width: 100% !important; }
      .content-table { width: 100% !important; max-width: 100% !important; }
      .section-padding { padding: 15px 15px !important; }
      .section-padding-tight { padding: 10px 15px !important; }
      .logo { width: 150px !important; height: auto !important; }
      .heading1 { font-size: 24px !important; }
      .heading2 { font-size: 20px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: Arial, Helvetica, sans-serif;">
  <center>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8f9fa;">
      <tr>
        <td align="center" style="padding: 20px 0;">
          <!-- Main Content Table -->
          <table role="presentation" class="content-table" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width: 650px; background-color: #ffffff; margin: 0 auto; border: 0;">
            <!-- Logo -->
            <tr>
              <td class="section-padding" style="padding: 15px 25px;">
                <img src="${logoUrl}" alt="Company Logo" width="180" class="logo" style="width: 180px; height: auto;" />
              </td>
            </tr>
            <!-- Content Area -->
            <tr>
              <td class="section-padding" style="padding: 15px 25px;">
                <!-- Heading -->
                <h1 class="heading1" style="font-family: Arial, Helvetica, sans-serif; font-size: 28px; color: ${brandColor}; margin-bottom: 15px; font-weight: bold;">
                  Custom Order Request Received
                </h1>

                <!-- Greeting -->
                <p style="font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #333333; line-height: 1.6; margin-bottom: 16px;">
                  <strong style="font-weight: bold; color: #000000;">Dear ${customerName},</strong>
                </p>

                <!-- Confirmation Text -->
                <p style="font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #333333; line-height: 1.6; margin-bottom: 20px;">
                  Thank you for submitting your custom order request. We have received your details and will review them shortly. You can find a summary of your request below.
                </p>

                <!-- Request Summary Section -->
                <h2 class="heading2" style="font-family: Arial, Helvetica, sans-serif; font-size: 22px; color: ${brandColor}; margin-bottom: 10px; font-weight: bold;">
                  Request Summary
                </h2>
                <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #eeeeee; border-radius: 4px; background-color: #f8f9fa; font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #333333; line-height: 1.6;">
                  ${requestId ? `<p style="margin-bottom: 5px;"><strong style="color: #555555;">Request ID:</strong> ${requestId}</p>` : ''}
                  <p style="margin-bottom: 5px;"><strong style="color: #555555;">Email:</strong> <a href="mailto:${customerEmail}" style="color: ${brandColor}; text-decoration: none;">${customerEmail}</a></p>
                  ${customerPhone ? `<p style="margin-bottom: 5px;"><strong style="color: #555555;">Phone:</strong> ${customerPhone}</p>` : ''}

                  <p style="margin-top: 15px; padding-top: 10px; border-top: 1px solid #dddddd;">
                    <strong style="color: #555555;">Details Provided:</strong><br />
                    ${formattedDetails}
                  </p>

                  ${fullAttachmentLink ? `
                  <p style="margin-top: 15px; padding-top: 10px; border-top: 1px solid #dddddd;">
                    <strong style="color: #555555;">Attachment:</strong><br />
                    <a href="${fullAttachmentLink}" target="_blank" style="color: ${brandColor}; text-decoration: underline;">View Attached File</a>
                  </p>` : ''}
                </div>

                <!-- Next Steps -->
                 <h2 class="heading2" style="font-family: Arial, Helvetica, sans-serif; font-size: 22px; color: ${brandColor}; margin-bottom: 10px; font-weight: bold;">
                  What Happens Next?
                </h2>
                <p style="font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #333333; line-height: 1.6; margin-bottom: 24px;">
                  Our team will review your request and get back to you soon with a quote or any follow-up questions. If you need to contact us in the meantime, please reply to this email or call us.
                </p>


                <!-- Regards -->
                <p style="font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #333333; line-height: 1.6; margin-bottom: 4px;">
                  Regards,
                </p>
                <p style="font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #333333; line-height: 1.6; margin-bottom: 24px;">
                  ${settings.storeName} Team
                </p>

                <!-- Footer Separator -->
                <hr style="border: 0; border-top: 1px solid #dee2e6; margin: 10px 0;">

                <!-- Footer Address Block -->
                 <p style="font-family: Arial, Helvetica, sans-serif; font-size: 12px; color: #6c757d; text-align: center; line-height: 1.5; margin-bottom: 5px;">
                    ${companyAddress}
                  </p>
                 <p style="font-family: Arial, Helvetica, sans-serif; font-size: 12px; color: #6c757d; text-align: center; line-height: 1.5; margin-bottom: 5px;">
                    Tel: ${companyPhone} | Email: <a href="mailto:${companyEmail}" style="color: ${brandColor}; text-decoration: none;">${companyEmail}</a>
                  </p>
                 <p style="font-family: Arial, Helvetica, sans-serif; font-size: 12px; color: #6c757d; text-align: center; line-height: 1.5;">
                    <a href="${companyWebsite}" target="_blank" style="color: ${brandColor}; text-decoration: none;">${companyWebsite}</a>
                 </p>

              </td>
            </tr>
            <!-- End Content Area -->
          </table>
          <!-- End Main Content Table -->
        </td>
      </tr>
       <!-- Footer Context -->
        <tr>
            <td align="center" style="padding: 24px 20px;">
                 <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 650px;">
                    <tr>
                        <td align="center" style="padding: 0; font-family: Arial, Helvetica, sans-serif; font-size: 12px; line-height: 18px; color: #6c757d;">
                            <p style="margin: 0;">You are receiving this email as confirmation of your custom order request submitted to ${settings.storeName}.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <!-- End Footer Context -->
    </table>
  </center>
</body>
</html>
`;
};



const sendQuoteUpdateCommentEmail = (quoteData, settings) => {
  const customerName = `${quoteData.firstName || ''} ${quoteData.lastName || ''}`.trim() || 'Valued Customer';
  const customerEmail = quoteData.email;
  const quoteTitle = quoteData?.title || 'Your Quote';
  const quoteId = quoteData?.id; 
  const newComment = quoteData?.comments; 
  const updatedAt = quoteData?.updatedAt; 

  const hasComment = newComment && typeof newComment === 'string' && newComment.trim().length > 0;
  const formattedComment = hasComment ? newComment.replace(/\n/g, '<br />') : '<i>No specific comment was provided with this update.</i>';

  const formatDate = (dateString) => {
    if (!dateString) return null; 
    try {
      return new Date(dateString).toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: 'numeric', minute: '2-digit', hour12: true
      });
    } catch (e) { return 'Invalid Date'; }
  };
  const formattedUpdateDate = formatDate(updatedAt);
  const apiUrl = settings.apiUrl
  const logoUrl = apiUrl + settings.logo;
  const companyWebsite = settings.storeURL; 
  const companyEmail = settings.email;
  const companyPhone = settings.phoneNumber; 
  const companyAddress = settings.address; 
  const brandColor = settings.primaryColor;



  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Update on Your Quote: ${quoteTitle}</title>
  <style>
    /* Basic Reset & Font - Copied from reference */
    body { margin: 0; padding: 0; background-color: #f8f9fa; font-family: Arial, Helvetica, sans-serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    td { vertical-align: top; }
    img { display: block; max-width: 100%; height: auto; border: 0; -ms-interpolation-mode: bicubic;}
    a { color: ${brandColor}; text-decoration: none; }
    p { margin: 0; padding: 0; }
    h1, h2 { margin: 0; padding: 0; font-weight: bold; }
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
    div[style*="margin: 16px 0;"] { margin: 0 !important; }

    /* Responsive Styles - Copied from reference */
    @media only screen and (max-width: 600px) {
      body { width: 100% !important; min-width: 100% !important; }
      .content-table { width: 100% !important; max-width: 100% !important; }
      .section-padding { padding: 15px 15px !important; }
      .section-padding-tight { padding: 10px 15px !important; }
      .logo { width: 150px !important; height: auto !important; }
      .heading1 { font-size: 24px !important; }
      .heading2 { font-size: 20px !important; }
      .comment-box { padding: 10px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: Arial, Helvetica, sans-serif;">
  <center>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8f9fa;">
      <tr>
        <td align="center" style="padding: 20px 0;">
          <!-- Main Content Table -->
          <table role="presentation" class="content-table" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width: 650px; background-color: #ffffff; margin: 0 auto; border: 0;">
            <!-- Logo -->
            <tr>
              <td class="section-padding" style="padding: 15px 25px;">
                <img src="${logoUrl}" alt="Company Logo" width="180" class="logo" style="width: 180px; height: auto;" />
              </td>
            </tr>
            <!-- Content Area -->
            <tr>
              <td class="section-padding" style="padding: 15px 25px;">
                <!-- Heading -->
                <h1 class="heading1" style="font-family: Arial, Helvetica, sans-serif; font-size: 28px; color: ${brandColor}; margin-bottom: 15px; font-weight: bold;">
                  Update on Your Quote
                </h1>

                <!-- Greeting -->
                <p style="font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #333333; line-height: 1.6; margin-bottom: 16px;">
                  <strong style="font-weight: bold; color: #000000;">Dear ${customerName},</strong>
                </p>

                <!-- Update Info -->
                <p style="font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #333333; line-height: 1.6; margin-bottom: 20px;">
                  We've added a comment or update regarding your quote request:
                </p>
                 <p style="font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #333333; line-height: 1.6; margin-bottom: 5px;">
                  <strong style="color: #555555;">Quote Subject:</strong> ${quoteTitle}
                </p>
                 ${quoteId ? `
                 <p style="font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #333333; line-height: 1.6; margin-bottom: 20px;">
                   <strong style="color: #555555;">Quote Ref:</strong> ${quoteId}
                 </p>` : ''}


                <!-- New Comment Section -->
                <h2 class="heading2" style="font-family: Arial, Helvetica, sans-serif; font-size: 22px; color: ${brandColor}; margin-bottom: 10px; font-weight: bold;">
                  Latest Update / Comment
                  ${formattedUpdateDate ? `<span style="font-size: 12px; color: #6c757d; font-weight: normal;"> (on ${formattedUpdateDate})</span>` : ''}
                </h2>
                <div class="comment-box" style="margin-bottom: 24px; padding: 15px; border: 1px solid #dee2e6; border-radius: 4px; background-color: #f0fcf4; /* Light green background for comment */ font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #333333; line-height: 1.6;">
                  ${formattedComment}
                </div>

                <!-- Call to Action (Optional) -->
                ${quoteData.quoteLink ? `
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom: 24px;" align="center">
                    <tr>
                        <td align="center" bgcolor="${brandColor}" style="border-radius: 4px;">
                            <a href="${quoteData.quoteLink}" target="_blank" style="display: inline-block; padding: 10px 20px; font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; color: #ffffff; text-decoration: none; border-radius: 4px;">
                                View Updated Quote Online
                            </a>
                        </td>
                    </tr>
                </table>
                ` : `
                <p style="font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #333333; line-height: 1.6; margin-bottom: 24px;">
                    Please feel free to reply to this email or contact us if you have any questions regarding this update.
                </p>
                `}


                <!-- Regards -->
                <p style="font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #333333; line-height: 1.6; margin-bottom: 4px;">
                  Regards,
                </p>
                <p style="font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #333333; line-height: 1.6; margin-bottom: 24px;">
                  ${settings.storeName} Team
                </p>

                <!-- Footer Separator -->
                <hr style="border: 0; border-top: 1px solid #dee2e6; margin: 10px 0;">

                <!-- Footer Address Block -->
                 <p style="font-family: Arial, Helvetica, sans-serif; font-size: 12px; color: #6c757d; text-align: center; line-height: 1.5; margin-bottom: 5px;">
                    ${companyAddress}
                  </p>
                 <p style="font-family: Arial, Helvetica, sans-serif; font-size: 12px; color: #6c757d; text-align: center; line-height: 1.5; margin-bottom: 5px;">
                    Tel: ${companyPhone} | Email: <a href="mailto:${companyEmail}" style="color: ${brandColor}; text-decoration: none;">${companyEmail}</a>
                  </p>
                 <p style="font-family: Arial, Helvetica, sans-serif; font-size: 12px; color: #6c757d; text-align: center; line-height: 1.5;">
                    <a href="${companyWebsite}" target="_blank" style="color: ${brandColor}; text-decoration: none;">${companyWebsite}</a>
                 </p>

              </td>
            </tr>
            <!-- End Content Area -->
          </table>
          <!-- End Main Content Table -->
        </td>
      </tr>
       <!-- Footer Context -->
        <tr>
            <td align="center" style="padding: 24px 20px;">
                 <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 650px;">
                    <tr>
                        <td align="center" style="padding: 0; font-family: Arial, Helvetica, sans-serif; font-size: 12px; line-height: 18px; color: #6c757d;">
                            <p style="margin: 0;">You are receiving this email regarding an update to your quote request with ${settings.storeName}.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <!-- End Footer Context -->
    </table>
  </center>
</body>
</html>
`;
};


const sendEmailToIndividualUserTempate = ( body, settings) => {
  const apiUrl = settings.apiUrl;
  const logoUrl = apiUrl + settings.logo;
  const companyWebsite = settings.storeURL; 
  const companyEmail = settings.email;
  const companyPhone = settings.phoneNumber; 
  const companyAddress = settings.address; 
  const brandColor = settings.primaryColor; 
  const companyName = settings.storeName; 

  const safeSubject = body.subject;
  const encodedBody = body.description || ''; 

    // --- *** DECODING, TEXT EXTRACTION & FORMATTING *** ---
    let formattedBodyText = '';
    let decodedBody = '';
    let plainText = '';
    try {
        if (encodedBody) {
            // 1. Decode HTML entities (< -> <, etc.)
            decodedBody = he.decode(encodedBody);
            console.log(`[Template Function V3] Decoded Body BEFORE sanitizeHtml: "${decodedBody}"`); // Log the actual HTML

            // 2. Strip ALL HTML tags using sanitize-html
            plainText = sanitizeHtml(decodedBody, { // Sanitize the DECODED string
                allowedTags: [],
                allowedAttributes: {},
                textFilter: function(text) { return text; }
            });
            console.log(`[Template Function V3] plainText AFTER sanitizeHtml: "${plainText}"`);

            // 3. Convert newlines in the extracted plain text to HTML <br /> tags
            if (plainText && plainText.trim()) {
                 formattedBodyText = plainText
                    .trim()
                    .replace(/(\r\n|\n|\r){2,}/g, '<br /><br />')
                    .replace(/(\r\n|\n|\r)/g, '<br />');
            } else {
                 formattedBodyText = '';
                 console.log("[Template Function V3] plainText was empty or only whitespace after processing.");
            }
             console.log(`[Template Function V3] Formatted Body Text (with <br>): "${formattedBodyText}"`);

        } else {
            console.log("[Template Function V3] Original encoded body was empty or null.");
            formattedBodyText = '';
        }
    } catch (processingError) {
        console.error("[Template Function V3] Error during decoding/sanitization/formatting:", processingError);
        formattedBodyText = "Error processing message content.";
    }
    // --- *** END PROCESSING *** ---


  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeSubject}</title>
  <style>
    /* Basic Reset & Font */
    body { margin: 0; padding: 0; background-color: #f8f9fa; font-family: Arial, Helvetica, sans-serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    td { vertical-align: top; text-align: left; }
    img { display: block; max-width: 100%; height: auto; border: 0; -ms-interpolation-mode: bicubic;}
    a { color: ${brandColor}; text-decoration: none; }
    /* Default styles for text INSIDE the main content area */
    /* Apply base styles directly to the TD containing the formatted text */
    .main-content {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 14px;
        color: #333333;
        line-height: 1.6;
        text-align: left;
        padding: 15px 25px; /* Match section-padding */
    }
     /* Give <br> tags consistent line height within the main content */
    .main-content br {
        line-height: 1.6em; /* Match the TD's line-height */
        content: "\\A"; /* Ensure break visually in some clients */
        white-space: pre-line; /* Help rendering breaks */
    }
    h1, h2, h3, h4, h5, h6 { margin: 0 0 0.75em 0; padding: 0; font-weight: bold; } /* Keep heading defaults */
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
    div[style*="margin: 16px 0;"] { margin: 0 !important; }

    /* Responsive Styles */
    @media only screen and (max-width: 600px) {
      body { width: 100% !important; min-width: 100% !important; }
      .content-table { width: 100% !important; max-width: 100% !important; }
      .section-padding, .main-content { padding: 15px 15px !important; } /* Adjust main content padding too */
      .logo { width: 150px !important; height: auto !important; }
      .email-subject-heading { font-size: 20px !important; margin-bottom: 15px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: Arial, Helvetica, sans-serif;">
  <center>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8f9fa;">
      <tr>
        <td align="center" style="padding: 20px 0;">
          <!-- Main Content Table -->
          <table role="presentation" class="content-table" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width: 650px; background-color: #ffffff; margin: 0 auto; border: 0;">
            <tr>
              <td class="section-padding" style="padding: 15px 25px;">
                <img src="${logoUrl}" alt="${companyName} Logo" width="180" class="logo" style="width: 180px; height: auto;" />
              </td>
            </tr>

            <!-- == Main Content Area == -->
            <tr>
              <td class="main-content">

                <h2 class="email-subject-heading" style="font-family: Arial, Helvetica, sans-serif; font-size: 22px; color: ${brandColor}; margin-bottom: 20px; font-weight: bold; border-bottom: 1px solid #eeeeee; padding-bottom: 10px;">
                    ${safeSubject}
                </h2>

                ${formattedBodyText}

              </td>
            </tr>
            <!-- == End Content Injection Area == -->

            <!-- Footer Separator -->
            <tr>
              <td style="padding: 10px 25px 0 25px;">
                <hr style="border: 0; border-top: 1px solid #dee2e6; margin: 10px 0;">
              </td>
            </tr>

            <!-- Footer Address Block -->
            <tr>
               <td class="section-padding" style="padding: 15px 25px;">
                 <p style="font-family: Arial, Helvetica, sans-serif; font-size: 12px; color: #6c757d; text-align: center; line-height: 1.5; margin-bottom: 5px;">
                    ${companyAddress}
                  </p>
                 <p style="font-family: Arial, Helvetica, sans-serif; font-size: 12px; color: #6c757d; text-align: center; line-height: 1.5; margin-bottom: 5px;">
                    Tel: ${companyPhone} | Email: <a href="mailto:${companyEmail}" style="color: ${brandColor}; text-decoration: none;">${companyEmail}</a>
                  </p>
                 <p style="font-family: Arial, Helvetica, sans-serif; font-size: 12px; color: #6c757d; text-align: center; line-height: 1.5;">
                    <a href="${companyWebsite}" target="_blank" style="color: ${brandColor}; text-decoration: none;">${companyWebsite}</a>
                 </p>
               </td>
            </tr>
            <!-- End Footer Address Block -->

          </table>
          <!-- End Main Content Table -->
        </td>
      </tr>
       <!-- Footer Context -->
        
    </table>
  </center>
</body>
</html>
`;
};


const sendResendInvoiceEmailTemplate = (invoiceData, settings) => {

  const customerName = `${invoiceData?.userId?.firstName || ''} ${invoiceData?.userId?.lastName || ''}`.trim() || 'Valued Customer';
  const orderId = invoiceData?.invoiceNo || 'N/A';
  const apiUrl = settings.apiUrl;
  const logoUrl = apiUrl + settings.logo;
  const companyWebsite = settings.storeURL;
  const loginUrl = `${companyWebsite}/login`;
  const companyEmail = settings.email;
  const companyPhone = settings.phoneNumber;
  const companyAddress = settings.address;
  const brandColor = settings.primaryColor;
  const companyName = settings.storeName;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Requested Invoice - Order #${orderId}</title>
  <style>
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #f8f9fa; font-family: Arial, Helvetica, sans-serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table { border-collapse: collapse !important; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    td { vertical-align: top; text-align: left; }
    img { display: block; max-width: 100%; height: auto; border: 0; -ms-interpolation-mode: bicubic;}
    a { color: ${brandColor}; text-decoration: none; }
    p { margin: 0; padding: 0; }
    h1, h2, h3, h4, h5, h6 { margin: 0 0 0.75em 0; padding: 0; font-weight: bold; }
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
    div[style*="margin: 16px 0;"] { margin: 0 !important; }
    .main-content p {
        margin: 0 0 1em 0;
        padding: 0;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 14px;
        line-height: 1.6;
        color: #333333;
    }
    .main-content p.greeting { margin-bottom: 16px; }
    .main-content p.closing { margin-top: 20px; }
    .email-subject-heading {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 24px;
        color: ${brandColor};
        margin: 0 0 20px 0;
        font-weight: bold;
        padding: 0;
    }
    .footer-text {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 12px;
        color: #6c757d;
        text-align: center;
        line-height: 1.5;
        margin-bottom: 5px;
    }
    hr.separator {
        border: 0;
        border-top: 1px solid #dee2e6;
        margin: 10px 0;
    }
    .section-padding {
        padding: 15px 25px; /* Default padding for header/footer */
    }
    .main-content-padding {
        padding: 25px 40px; /* Increased padding for main content on desktop */
    }

    @media only screen and (max-width: 600px) {
      body { width: 100% !important; min-width: 100% !important; }
      .content-table { width: 100% !important; max-width: 100% !important; }
      .section-padding { padding: 15px 15px !important; } /* Mobile padding for header/footer */
      .main-content-padding { padding: 20px 15px !important; } /* Adjusted mobile padding for main content */
      .logo { width: 150px !important; height: auto !important; }
      .email-subject-heading { font-size: 22px !important; margin-bottom: 15px !important; }
      .footer-text { font-size: 11px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: Arial, Helvetica, sans-serif;">
  <center>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8f9fa;">
      <tr>
        <td align="center" style="padding: 20px 0;">
          <table role="presentation" class="content-table" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width: 650px; background-color: #ffffff; margin: 0 auto; border: 0;">
            <tr>
              <td class="section-padding">
                <img src="${logoUrl}" alt="${companyName} Logo" width="180" class="logo" style="width: 180px; height: auto;" />
              </td>
            </tr>

            <tr>
              <td class="main-content-padding main-content">
                <h2 class="email-subject-heading">
                    Your Requested Invoice
                </h2>
                <p class="greeting">
                  <strong style="color: #000000;">Hello Dear ${customerName},</strong>
                </p>
                <p>
                  As requested, we are resending a copy of your invoice for order <strong style="color: #000000;">#${orderId}</strong> placed with ${companyName}.
                </p>
                <p>
                  You can view and manage your order by
                  <a href="${loginUrl}" target="_blank" style="color: ${brandColor}; text-decoration: underline;">logging into your account</a>.
                  If you have any questions, please don't hesitate to contact us at
                  <a href="mailto:${companyEmail}" style="color: ${brandColor}; text-decoration: underline;">${companyEmail}</a>.
                </p>
                <p>
                  Thank you for choosing ${companyName}. We appreciate your business!
                </p>
                <p class="closing">
                  Best regards,<br/>The ${companyName} Team
                 </p>
              </td>
            </tr>

            <tr>
              <td style="padding: 10px 40px 0 40px;">
                <hr class="separator" />
              </td>
            </tr>

            <tr>
               <td class="section-padding" style="padding: 15px 25px;">
                 <p class="footer-text">
                    ${companyAddress}
                  </p>
                 <p class="footer-text">
                    Tel: ${companyPhone} | Email: <a href="mailto:${companyEmail}" style="color: ${brandColor}; text-decoration: none;">${companyEmail}</a>
                  </p>
                 <p class="footer-text" style="margin-bottom: 0;">
                    <a href="${companyWebsite}" target="_blank" style="color: ${brandColor}; text-decoration: none;">${companyWebsite}</a>
                 </p>
               </td>
            </tr>

          </table>
        </td>
      </tr>
        <tr>
            <td align="center" style="padding: 24px 20px;">
                 <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 650px;">
                   
                </table>
            </td>
        </tr>
    </table>
  </center>
</body>
</html>
`;
};



const sendAdminPasswordResetTemplate = (name, url, settings) => {

  const userName = name || 'Valued Customer';
  const resetUrl = url; 
  const expiryInfo = 'This link will expire in an hour.';
  const apiUrl = settings.apiUrl;
  const logoUrl = apiUrl + settings.logo || ""; 
  const brandColor = settings.primaryColor || "";
  const companyName = settings.storeName || "";
  const companyAddress = settings.address || "";
  const companyPhone = settings.phoneNumber || "";
  const companyEmail = settings.email || '';
  const companyWebsite =settings.storeURL || '';
  const emailSubject =  `Password Reset Request - Admin ${companyName}`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${emailSubject}</title>
  <style>
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #f8f9fa; font-family: Arial, Helvetica, sans-serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table { border-collapse: collapse !important; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    td { vertical-align: top; text-align: left; }
    img { display: block; max-width: 100%; height: auto; border: 0; -ms-interpolation-mode: bicubic;}
    /* Use the dynamic brandColor for links */
    a { color: ${brandColor}; text-decoration: none; }
    p { margin: 0; padding: 0; }
    h1, h2, h3, h4, h5, h6 { margin: 0 0 0.75em 0; padding: 0; font-weight: bold; }
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
    div[style*="margin: 16px 0;"] { margin: 0 !important; }
    .main-content p {
        margin: 0 0 1em 0;
        padding: 0;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 14px;
        line-height: 1.6;
        color: #333333;
    }
    .main-content p.greeting { margin-bottom: 16px; }
    .main-content p.expiry-info {
        font-size: 12px; /* Smaller font for expiry */
        color: #6c757d; /* Grey color */
        margin-top: 20px; /* Space above expiry */
    }
    .email-subject-heading {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 24px;
        /* Use the dynamic brandColor */
        color: ${brandColor};
        margin: 0 0 20px 0;
        font-weight: bold;
        padding: 0;
    }
    .footer-text {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 12px;
        color: #6c757d;
        text-align: center;
        line-height: 1.5;
        margin-bottom: 5px;
    }
    hr.separator {
        border: 0;
        border-top: 1px solid #dee2e6;
        margin: 10px 0;
    }
    .section-padding {
        padding: 15px 25px;
    }
    .main-content-padding {
        padding: 25px 40px;
    }
    .button-td {
        border-radius: 4px;
        /* Use the dynamic brandColor */
        background-color: ${brandColor};
    }
    .button-a {
        display: inline-block;
        padding: 12px 25px;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 16px;
        font-weight: bold;
        color: #ffffff; /* White text */
        text-decoration: none;
        border-radius: 4px;
    }
    .button-td:hover, .button-a:hover {
        /* Define a slightly darker hover color - simple approach */
        background-color: #3a7a80 !important; /* You might pass a hoverColor var too */
    }

    @media only screen and (max-width: 600px) {
      body { width: 100% !important; min-width: 100% !important; }
      .content-table { width: 100% !important; max-width: 100% !important; }
      .section-padding { padding: 15px 15px !important; }
      .main-content-padding { padding: 20px 15px !important; }
      .logo { width: 150px !important; height: auto !important; }
      .email-subject-heading { font-size: 22px !important; margin-bottom: 15px !important; }
      .footer-text { font-size: 11px !important; }
      .button-a { padding: 10px 20px !important; font-size: 15px !important;}
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: Arial, Helvetica, sans-serif;">
  <center>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8f9fa;">
      <tr>
        <td align="center" style="padding: 20px 0;">
          <table role="presentation" class="content-table" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width: 650px; background-color: #ffffff; margin: 0 auto; border: 0;">
            <tr>
              <td class="section-padding">
                <img src="${logoUrl}" alt="${companyName} Logo" width="180" class="logo" style="width: 180px; height: auto;" />
              </td>
            </tr>

            <tr>
              <td class="main-content-padding main-content">
                <h2 class="email-subject-heading">
                    Password Reset Request
                </h2>

                <p class="greeting">
                  <strong style="color: #000000;">Hello ${userName},</strong>
                </p>
                <p>
                  We received a request to reset the password associated with your account.
                </p>
                <p>
                  Click the button below to set a new password:
                </p>

                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin-top: 20px; margin-bottom: 20px;" align="left">
                    <tr>
                        
                        <td align="center" class="button-td" style="border-radius: 4px; background-color: ${brandColor};">
                          
                            <a href="${resetUrl}" target="_blank" class="button-a" style="display: inline-block; padding: 12px 25px; font-family: Arial, Helvetica, sans-serif; font-size: 16px; font-weight: bold; color: #ffffff; text-decoration: none; border-radius: 4px;">
                                Reset Password
                            </a>
                        </td>
                    </tr>
                </table>
                <div style="clear: both; height: 1px; line-height: 1px;"> </div>

                <p style="margin-top: 20px;">
                    If you did not request a password reset, please ignore this email or contact us if you have concerns.
                </p>
                 <p class="expiry-info">
                    ${expiryInfo}
                 </p>
              </td>
            </tr>

            <tr>
              <td style="padding: 10px 40px 0 40px;">
                <hr class="separator" />
              </td>
            </tr>

            <tr>
               <td class="section-padding" style="padding: 15px 25px;">
                 <p class="footer-text">
                    ${companyAddress}
                  </p>
                 <p class="footer-text">
                    Tel: ${companyPhone} | Email: <a href="mailto:${companyEmail}" style="color: ${brandColor}; text-decoration: none;">${companyEmail}</a>
                  </p>
                 <p class="footer-text" style="margin-bottom: 0;">
                    <a href="${companyWebsite}" target="_blank" style="color: ${brandColor}; text-decoration: none;">${companyWebsite}</a>
                 </p>
               </td>
            </tr>

          </table>
        </td>
      </tr>
       
    </table>
  </center>
</body>
</html>
`;
};


module.exports = {
  addTrackingNumberEmailTemplate,
  newsLetterSubscribedEmailTemplate,
  verifyAccountEmailTemplate,
  sendOrderEmailTemplate,
  sendEmailToIndividualUserTempate,
  resetPasswordEmailTemplate,
  virginMaryChurchNewsLetter,
  eventSubscribeTemplate,
  sendNotificationOfOrderModifications,
  sendQuoteEmailTemplate,
  sendCustomOrderRequestEmail,
  sendQuoteUpdateCommentEmail,
  sendResendInvoiceEmailTemplate,
  sendAdminPasswordResetTemplate,
};
