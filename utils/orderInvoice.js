
// module.exports = (id, customer, invoice) => {

//    const today = new Date();

//    return (
//       `
//         <!doctype html>
//         <html>
//            <head>
//               <meta charset="utf-8">
//               <title>Order Invoice - ${id}</title>
//               <style>
//                  .invoice-box {
//                  max-width: 800px;
//                  margin: auto;
//                  padding: 30px;
//                  border: 1px solid #eee;
//                  box-shadow: 0 0 10px rgba(0, 0, 0, .15);
//                  font-size: 16px;
//                  line-height: 24px;
//                  font-family: 'Helvetica Neue', 'Helvetica',
//                  color: #555;
//                  }
//                  .margin-top {
//                  margin-top: 50px;
//                  }
//                  .justify-center {
//                  text-align: center;
//                  }
//                  .invoice-box table {
//                  width: 100%;
//                  line-height: inherit;
//                  text-align: left;
//                  }
//                  .invoice-box table td {
//                  padding: 5px;
//                  vertical-align: top;
//                  }
//                  .invoice-box table tr td:nth-child(2) {
//                  text-align: right;
//                  }
//                  .invoice-box table tr.top table td {
//                  padding-bottom: 20px;
//                  }
//                  .invoice-box table tr.top table td.title {
//                  font-size: 45px;
//                  line-height: 45px;
//                  color: #333;
//                  }
//                  .invoice-box table tr.information table td {
//                  padding-bottom: 40px;
//                  }
//                  .invoice-box table tr.heading td {
//                  background: #eee;
//                  border-bottom: 1px solid #ddd;
//                  font-weight: bold;
//                  }
//                  .invoice-box table tr.details td {
//                  padding-bottom: 20px;
//                  }
//                  .invoice-box table tr.item td {
//                  border-bottom: 1px solid #eee;
//                  }
//                  .invoice-box table tr.item.last td {
//                  border-bottom: none;
//                  }
//                  .invoice-box table tr.total td:nth-child(2) {
//                  border-top: 2px solid #eee;
//                  font-weight: bold;
//                  }
//                  @media only screen and (max-width: 600px) {
//                  .invoice-box table tr.top table td {
//                  width: 100%;
//                  display: block;
//                  text-align: center;
//                  }
//                  .invoice-box table tr.information table td {
//                  width: 100%;
//                  display: block;
//                  text-align: center;
//                  }
//                  }
//               </style>
//            </head>
//            <body>
//               <div class="invoice-box">
//                  <table cellpadding="0" cellspacing="0">
//                     <tr class="top">
//                        <td colspan="2">
//                           <table>
//                              <tr>
//                                 <td class="title">
//                                   <h2> Design Print NYC </h2>
//                                 </td>
//                                 <td>
//                                    Genrated On : ${`${today.getDate()}. ${today.getMonth() + 1}. ${today.getFullYear()}.`}
//                                 </td>
//                              </tr>
//                           </table>
//                        </td>
//                     </tr>
//                     <tr class="information">
//                     <td colspan="2">
//                        <table>
//                           <tr>
//                              <td>
//                                 Customer name: ${customer.name}
//                              </td>
//                              <td>
//                                 Invoice number: ${invoice.id}
//                              </td>
//                           </tr>
//                        </table>
//                     </td>
//                  </tr>
//                  </table>
//                  <br />
//               </div>
//            </body>
//         </html>`
//    )
// }
const Settings = require("../models/settings.model");

module.exports = (order) => {

    const settings = Settings.findOne();

   return (
      `
      <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice ${order.invoiceNo}</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>

<body>

    <section id="invoice">
        <div class="container my-2 py-2">
            <div class="text-center">
                <img src="http://116.0.52.19:3000/public/uploads/logo/logo.png" alt="">
            </div>
            <div class="text-center border-top border-bottom my-2 py-2">
                <h2>Order Invoice</h2>
                <p class="m-0">Invoice No: ${order.invoiceNo}</p>
                <p class="m-0">Invoice Date: ${order.orderDate}</p>
            </div>

            <div class="d-md-flex justify-content-between">
                <div>
                    <p class="text-primary">Shipping Address</p>
                    <h4> ${order.billingAddress.firstName} </h4>
                    <ul class="list-unstyled">
                        <li></li>
                        <li></li>
                        <li></li>
                    </ul>
                </div>
                <div class="mt-5 mt-md-0">
                    <p class="text-primary">Invoice From</p>
                    <h4>Shoaib Sheikh</h4>
                    <ul class="list-unstyled">
                        <li> ${settings.storeName}</li>
                        <li>${settings.email}</li>
                        <li>${settings.address}</li>
                    </ul>
                </div>
            </div>

            <table class="table border my-5">
                <thead>
                    <tr style="background-color: #292d32; color: #fff;">
                        <th scope="col">No.</th>
                        <th scope="col">Items</th>
                        <th scope="col">Options</th>
                        <th scope="col">$ Price <span
                            style="font-size: x-small; font-weight: 500;"> ( per set )</span> </th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">1</th>
                        <td>
                            <p style="padding: 0; margin: 0; "> Zarba Azam <span
                                    style="font-size: x-small; font-weight: 500;"> ( Standard Business Card )</span>
                            </p>
                        </td>
                        <td>
                            <p class="p-0 m-0 fw-semibold " >Size: <span class="fw-normal fs-6" >3.5" x 2"</span></p>
                            <p class="p-0 m-0 fw-semibold " >Size: <span class="fw-normal fs-6" >3.5" x 2"</span></p>
                            <p class="p-0 m-0 fw-semibold " >Size: <span class="fw-normal fs-6" >3.5" x 2"</span></p>
                            <p class="p-0 m-0 fw-semibold " >Size: <span class="fw-normal fs-6" >3.5" x 2"</span></p>
                            <p class="p-0 m-0 fw-semibold " >Size: <span class="fw-normal fs-6" >3.5" x 2"</span></p>
                        </td>
                        <td>$350.00</td>
                        <td>2</td>
                        <td>$700.00</td>
                    </tr>

                    <tr>
                        <th></th>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td class="">Sub-Total</td>
                        <td>$2,350.00</td>
                    </tr>
                    <tr>
                        <th></th>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td class="text-primary fw-bold">Grand-Total</td>
                        <td class="text-primary fw-bold">$1,880.00</td>
                    </tr>
                </tbody>
            </table>

            <div class="d-md-flex justify-content-between my-5">
                <div>
                    <h5 class="fw-bold my-4">Contact Us</h5>
                    <ul class="list-unstyled">
                        <li><iconify-icon class="social-icon text-primary fs-5 me-2" icon="mdi:location"
                                style="vertical-align:text-bottom"></iconify-icon> 345 N Main St 3, NYC, USA</li>
                        <li><iconify-icon class="social-icon text-primary fs-5 me-2" icon="solar:phone-bold"
                                style="vertical-align:text-bottom"></iconify-icon> (631) 578-5131</li>
                        <li><iconify-icon class="social-icon text-primary fs-5 me-2" icon="ic:baseline-email"
                                style="vertical-align:text-bottom"></iconify-icon> signanddesignstudio@gmail.com</li>
                    </ul>
                </div>
                <div>
                    <h5 class="fw-bold my-4">Payment Info</h5>
                    <ul class="list-unstyled">
                        <li><span class="fw-semibold">Account Name: </span> William Peter</li>
                        <li><span class="fw-semibold">Branch Name: </span> XYZ </li>

                    </ul>
                </div>


            </div>

            <div class="text-center my-5">
                <p class="text-muted"><span class="fw-semibold">Thank You </p>
            </div>


        </div>
    </section>



    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-ENjdO4Dr2bkBIFxQpeoTz1HIcje39Wm4jDKdf19U8gI4ddQ3GYNS7NTKfAdVQSZe"
        crossorigin="anonymous"></script>
    <script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js"></script>

</body>

</html>
      `
   )
}