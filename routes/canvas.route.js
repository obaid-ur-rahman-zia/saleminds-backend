const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const pdf = require("pdf2json");
const { convert } = require("pdf-poppler");
const { Pdfparser } = require("pdf2json");
const sharp = require("sharp");
const fabric = require("fabric").fabric;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/temp/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extname = path.extname(file.originalname);
    cb(null, uniqueSuffix + extname);
  },
});

const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

const getBorderRect = (padding, color, size) => {
  const innerWidth = size.width - 2 * padding;
  const innerHeight = size.height - 2 * padding;

  // Create a rectangle with padding
  const borderRect = new fabric.Rect({
    left: padding, // Start X position
    top: padding, // Start Y position
    width: innerWidth,
    height: innerHeight,
    fill: "", // No fill
    stroke: color, // Border color
    strokeWidth: 1, // Border width
    selectable: false, // Disable selection
  });

  return borderRect;
};

router.post("/upload", upload.any("image"), (req, res, next) => {
  // console.log("req.file", req.files[0]);
  // console.log(req.body.multiple);

  if (req.files[0].mimetype === "application/pdf") {
    const path1 = path.join(__dirname, "..", "public", "uploads", "temp", req.files[0].filename);

    const pdfBuffer = fs.readFileSync(path1);

    // Initialize PDF parser
    const pdfParser = new pdf();

    // Parse the PDF file
    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      // Get page information
      const pages = pdfData.Pages;

      const options = {
        format: "jpeg",
        out_dir: "public/uploads/temp", // Output directory for images
        out_prefix: path.basename(path1, path.extname(path1)),
        page: 1, // Convert all pages
      };

      // Convert PDF to image
      convert(path1, { ...options })
        .then((result) => {
          console.log("Images converted successfully:", path.basename(path1, path.extname(path1)));

          const imageLink =
            "public/uploads/temp/" + path.basename(path1, path.extname(path1)) + "-1.jpg";

          const pdfLink =
            "public/uploads/temp/" + path.basename(path1, path.extname(path1)) + ".pdf";

          res.send({
            imageLink,
            pdfLink,
          });
        })
        .catch((error) => {
          console.error("Error converting PDF to image:", error);
        });
    });

    // Load PDF buffer
    pdfParser.parseBuffer(pdfBuffer);
  } else {
    const image = req.files[0].destination + req.files[0].filename;
    // Send the path to the converted JPG file
    res.send({
      imageLink: image,
      pdfLink: null,
    });
  }
});

// ****************
// this need to be done
// ****************
// router.post("/upload", upload.any("image"), (req, res, next) => {
//   const image = req.files[0].destination + req.files[0].filename;
//   // const canvas = new fabric.StaticCanvas(null, {
//   //   width: parseFloat(req.body.width) * 100,
//   //   height: parseFloat(req.body.height) * 100,
//   // });
//   const canvas = new fabric.StaticCanvas(null, {
//     width: 1200,
//     height: 1200,
//   });
//   const blackLine = getBorderRect(1, "black", {
//     width: parseFloat(req.body.width) * 100,
//     height: parseFloat(req.body.height) * 100,
//   });
//   const redLine = getBorderRect(5, "red", {
//     width: parseFloat(req.body.width) * 100,
//     height: parseFloat(req.body.height) * 100,
//   });
//   const blueLine = getBorderRect(10, "blue", {
//     width: parseFloat(req.body.width) * 100,
//     height: parseFloat(req.body.height) * 100,
//   });

//   // canvas.add(blackLine);
//   // canvas.add(redLine);
//   // canvas.add(blueLine);
//   console.log("req.file", req.files[0]);

//   if (req.files[0].mimetype === "application/pdf") {
//     const path1 = path.join(__dirname, "..", "public", "uploads", "temp", req.files[0].filename);

//     const pdfBuffer = fs.readFileSync(path1);

//     // Initialize PDF parser
//     const pdfParser = new pdf();

//     // Parse the PDF file
//     pdfParser.on("pdfParser_dataReady", (pdfData) => {
//       // console.log("pdfData", pdfData);
//       // Get page information
//       const pages = pdfData.Pages;

//       // Loop through each page
//       const width = pages[0].Width / 4.5;
//       const height = pages[0].Height / 4.5;
//       console.log(`Page: Width: ${width}, Height: ${height}`);

//       const options = {
//         format: "jpeg",
//         out_dir: "public/uploads/temp", // Output directory for images
//         out_prefix: path.basename(path1, path.extname(path1)),
//         page: 1, // Convert all pages
//       };

//       // Convert PDF to image
//       convert(path1, { ...options })
//         .then((result) => {
//           console.log("Images converted successfully:", path.basename(path1, path.extname(path1)));
//           const imageName =
//             "public/uploads/temp/" + path.basename(path1, path.extname(path1)) + "-1.jpg";

//           const path2 = path.join(
//             __dirname,
//             "..",
//             "public",
//             "uploads",
//             "temp",
//             `${path.basename(path1, path.extname(path1))}.png`
//           );
//           const imageName2 =
//             "public/uploads/temp/" + path.basename(path1, path.extname(path1)) + ".png";
//           sharp(imageName)
//             .resize()
//             .toFile(path2, (err, info) => {
//               if (err) {
//                 console.error(err);
//               } else {
//                 console.log("info", info);
//                 fabric.Image.fromURL(`${process.env.BASE_URL}${imageName2}`, (img) => {
//                   const widthInInches = width * 200; // Assuming 96 pixels per inch
//                   const heightInInches = height * 200; // Assuming 96 pixels per inch

//                   canvas.setWidth(widthInInches);
//                   canvas.setHeight(heightInInches);

//                   const imageAspectRatio = img.width / img.height;
//                   const canvasAspectRatio = canvas.getWidth() / canvas.getHeight();

//                   let scaleFactor = 1;
//                   if (imageAspectRatio > canvasAspectRatio) {
//                     scaleFactor = canvas.getWidth() / img.width;
//                   } else {
//                     scaleFactor = canvas.getHeight() / img.height;
//                   }

//                   console.log("scaleFactor", scaleFactor);

//                   // Resize the image
//                   img.scale(scaleFactor);

//                   canvas.add(img);

//                   const box = new fabric.Rect({
//                     width: 3.5 * 200, // Width of the box
//                     height: 2 * 200, // Height of the box
//                     fill: "transparent", // Transparent fill
//                     stroke: "red", // Red border
//                     strokeWidth: 1, // Border width
//                     originX: "center", // Center horizontally
//                     originY: "center", // Center vertically
//                     left: canvas.width / 2, // Center horizontally on canvas
//                     top: canvas.height / 2, // Center vertically on canvas
//                   });
//                   const box2 = new fabric.Rect({
//                     width: 3.625 * 200, // Width of the box
//                     height: 2.125 * 200, // Height of the box

//                     fill: "transparent", // Transparent fill
//                     stroke: "black", // Red border
//                     strokeWidth: 1, // Border width
//                     originX: "center", // Center horizontally
//                     originY: "center", // Center vertically
//                     left: canvas.getWidth() / 2, // Center horizontally on canvas
//                     top: canvas.getHeight() / 2, // Center vertically on canvas
//                   });
//                   canvas.add(box);
//                   canvas.add(box2);
//                   // canvas.clipPath = box;

//                   const canvasImage = canvas.toDataURL({
//                     format: "png",
//                     quality: 1,
//                     multiplier: 2,
//                     width: canvas.getWidth(),
//                     height: canvas.getHeight(),
//                   });

//                   // const canvasImage = canvas.toDataURL({
//                   //   format: "jpeg", // Change format as needed (jpeg, png, or pdf)
//                   //   quality: 1, // JPEG quality (0 to 1)
//                   //   // left: 200, // Center horizontally on canvas
//                   //   // top: 200, // Center vertically on canvas
//                   //   width: canvas.getWidth() / 2, // Center horizontally on canvas
//                   //   height: canvas.getHeight() / 2, // Center vertically on canvas
//                   //   multiplier: 2,
//                   // });

//                   const canvasJSON = JSON.stringify(canvas.toJSON());

//                   res.json({
//                     canvasImage,
//                     canvasJSON,
//                     origionalURL: `${process.env.BASE_URL}${imageName2}`,
//                   });
//                 });
//               }
//             });
//         })
//         .catch((error) => {
//           console.error("Error converting PDF to image:", error);
//         });
//     });

//     // Load PDF buffer
//     pdfParser.parseBuffer(pdfBuffer);
//   } else {
//     // Send the path to the converted JPG file
//     fabric.Image.fromURL(`${process.env.BASE_URL}${image}`, (img) => {
//       canvas.add(img);
//       canvas.moveTo(blackLine, canvas.getObjects().length - 1);
//       canvas.moveTo(redLine, canvas.getObjects().length - 1);
//       canvas.moveTo(blueLine, canvas.getObjects().length - 1);

//       const canvasJSON = JSON.stringify(canvas.toJSON());
//       // Convert canvas to image
//       const canvasImage = canvas.toDataURL({
//         format: "png",
//         quality: 1,
//         // width: 656.55172413793,
//         // height: 375.1724137931,
//       });

//       // Send response with canvas image and JSON data
//       res.json({
//         canvasImage,
//         canvasJSON,
//       });
//     });
//   }
// });

function getObjectBoundingBox(object) {
  let points = object.getBoundingRect();
  return {
    left: points.left,
    top: points.top,
    width: points.width,
    height: points.height,
  };
}

router.post("/submit-artwork", async (req, res, next) => {
  const { artworkShipments } = req.body;

  let tempArtworkShipments = [];

  // tempArtworkShipments = artworkShipments.map((shipment) => {
  //   let modifiedShipment = shipment.map((set) => {
  //     let modifiedArtworks = [];
  //     set.artwork.map((artwork) => {
  //       const canvas = new fabric.StaticCanvas(null, {
  //         width: 4.42 * 200,
  //         height: 2.92 * 200,
  //       });
  //       const parsedJson = JSON.parse(artwork.canvasJSON);
  //       canvas.loadFromJSON(parsedJson, function () {
  //         canvas.renderAll();
  //         const cutLine = canvas
  //           .getObjects()
  //           .find((obj) => obj.type === "rect" && obj.stroke === "black");
  //         const originalCtx = canvas.getContext("2d");
  //         const imageData = originalCtx.getImageData(
  //           80,
  //           80,
  //           3.625 * 200, // Width of the box
  //           2.125 * 200 // Height of the box
  //         );
  //         const clippedCanvas = new fabric.StaticCanvas(null, {
  //           width: 3.625 * 200,
  //           height: 2.125 * 200,
  //         });
  //         const clippedCtx = clippedCanvas.getContext("2d");
  //         clippedCtx.putImageData(imageData, 0, 0);
  //         const canvasImage = clippedCtx.canvas.toDataURL({
  //           format: "png",
  //           quality: 1,
  //         });
  //         modifiedArtworks.push({
  //           ...artwork,
  //           finalImage: canvasImage,
  //         });
  //         // return {
  //         //   ...artwork,
  //         //   finalImage: canvasImage,
  //         // };
  //       });
  //     });

  //     console.log("modifiedArtworks", modifiedArtworks);
  //     return {
  //       ...set,
  //       artwork: modifiedArtworks,
  //     };
  //   });
  //   console.log("modifiedShipment", modifiedShipment);
  //   return modifiedShipment;
  // });

  tempArtworkShipments = await Promise.all(
    artworkShipments.map(async (shipment) => {
      let modifiedShipment = await Promise.all(
        shipment.map(async (set) => {
          let modifiedArtworks = [];

          await Promise.all(
            set.artwork.map(async (artwork) => {
              const canvas = new fabric.StaticCanvas(null, {
                width: 4.42 * 200,
                height: 2.92 * 200,
              });
              const parsedJson = JSON.parse(artwork.canvasJSON);
              await new Promise((resolve, reject) => {
                canvas.loadFromJSON(parsedJson, function () {
                  canvas.renderAll();
                  const cutLine = canvas
                    .getObjects()
                    .find((obj) => obj.type === "rect" && obj.stroke === "black");
                  const originalCtx = canvas.getContext("2d");
                  const imageData = originalCtx.getImageData(
                    80,
                    80,
                    3.625 * 200, // Width of the box
                    2.125 * 200 // Height of the box
                  );
                  const clippedCanvas = new fabric.StaticCanvas(null, {
                    width: 3.625 * 200,
                    height: 2.125 * 200,
                  });
                  const clippedCtx = clippedCanvas.getContext("2d");
                  clippedCtx.putImageData(imageData, 0, 0);
                  const canvasImage = clippedCtx.canvas.toDataURL({
                    format: "png",
                    quality: 1,
                  });
                  modifiedArtworks.push({
                    ...artwork,
                    finalImage: canvasImage,
                  });
                  resolve();
                });
              });
            })
          );

          return {
            ...set,
            artwork: modifiedArtworks,
          };
        })
      );
      return modifiedShipment;
    })
  );

  res.send(tempArtworkShipments);

  // var canvas1 = new fabric.StaticCanvas(null, {
  //   width: 4.42 * 200,
  //   height: 2.92 * 200,
  //   // width: 3.5 * 200,
  //   // height: 2 * 200,
  // });
  // let parsedJson2 = JSON.parse(artworks[1].canvasJSON);

  // // let canvasImage1 = null;
  // // let canvasImage2 = null;

  // canvas1.loadFromJSON(parsedJson1, function () {
  //   canvas1.renderAll();
  //   let cutLine = canvas1.getObjects().find((obj) => obj.type === "rect" && obj.stroke === "black");
  //   // canvas1.clipPath = cutLine;
  //   // canvas1.renderAll();
  //   const originalCtx = canvas1.getContext("2d");
  //   const imageData = originalCtx.getImageData(
  //     80,
  //     80,
  //     3.625 * 200, // Width of the box
  //     2.125 * 200 // Height of the box
  //   );
  //   const clippedCanvas = new fabric.StaticCanvas(null, {
  //     width: 3.625 * 200,
  //     height: 2.125 * 200,
  //   });
  //   const clippedCtx = clippedCanvas.getContext("2d");
  //   clippedCtx.putImageData(imageData, 0, 0);
  //   const canvasImage1 = clippedCtx.canvas.toDataURL({
  //     format: "png",
  //     quality: 1,
  //   });

  //   // clippedCanvas.renderAll();
  //   // Export the end image as data URL
  //   // const imageDataURL = clippedCtx.canvas.toDataURL("image/jpeg", 0.95);
  //   // // console.log("imageDataURL", imageDataURL);
  //   // // Convert data URL to buffer
  //   // const base64Data = imageDataURL.replace(/^data:image\/jpeg;base64,/, "");
  //   // const buffer = Buffer.from(base64Data, "base64");
  //   // // Write the buffer to a file
  //   // fs.writeFileSync("clipped_image.jpg", buffer);

  //   // const canvasImage1 = canvas1.toDataURL({
  //   //   format: "png",
  //   //   quality: 1,
  //   // });

  //   canvas2.loadFromJSON(parsedJson2, function () {
  //     canvas2.renderAll();
  //     cutLine = canvas2.getObjects().find((obj) => obj.type === "rect" && obj.stroke === "red");
  //     // canvas2.clipPath = cutLine;
  //     // canvas2.renderAll();

  //     const originalCtx2 = canvas2.getContext("2d");
  //     const imageData2 = originalCtx2.getImageData(
  //       80,
  //       80,
  //       3.625 * 200, // Width of the box
  //       2.125 * 200 // Height of the box
  //     );
  //     const clippedCanvas2 = new fabric.StaticCanvas(null, {
  //       width: 3.625 * 200,
  //       height: 2.125 * 200,
  //     });
  //     const clippedCtx2 = clippedCanvas2.getContext("2d");
  //     clippedCtx2.putImageData(imageData2, 0, 0);
  //     const canvasImage2 = clippedCtx2.canvas.toDataURL({
  //       format: "png",
  //       quality: 1,
  //     });
  //     // const canvasImage2 = canvas2.toDataURL({
  //     //   format: "png",
  //     //   quality: 1,
  //     // });
  //     res.json({
  //       canvasImage1,
  //       canvasImage2,
  //     });
  //   });
  // });
});

router.post("/3d/get3d", (req, res, next) => {
  const { artworks } = req.body;
  var canvas1 = new fabric.StaticCanvas(null, {
    width: 4.42 * 200,
    height: 2.92 * 200,
    // width: 3.5 * 200,
    // height: 2 * 200,
  });
  var canvas2 = new fabric.StaticCanvas(null, {
    width: 4.42 * 200,
    height: 2.92 * 200,
    // width: 3.5 * 200,
    // height: 2 * 200,
  });
  let parsedJson1 = JSON.parse(artworks[0].canvasJSON);
  let parsedJson2 = JSON.parse(artworks[1].canvasJSON);

  // let canvasImage1 = null;
  // let canvasImage2 = null;

  canvas1.loadFromJSON(parsedJson1, function () {
    canvas1.renderAll();
    let cutLine = canvas1.getObjects().find((obj) => obj.type === "rect" && obj.stroke === "black");
    // canvas1.clipPath = cutLine;
    // canvas1.renderAll();
    const originalCtx = canvas1.getContext("2d");
    const imageData = originalCtx.getImageData(
      80,
      80,
      3.625 * 200, // Width of the box
      2.125 * 200 // Height of the box
    );
    const clippedCanvas = new fabric.StaticCanvas(null, {
      width: 3.625 * 200,
      height: 2.125 * 200,
    });
    const clippedCtx = clippedCanvas.getContext("2d");
    clippedCtx.putImageData(imageData, 0, 0);
    const canvasImage1 = clippedCtx.canvas.toDataURL({
      format: "png",
      quality: 1,
    });

    // clippedCanvas.renderAll();
    // Export the end image as data URL
    // const imageDataURL = clippedCtx.canvas.toDataURL("image/jpeg", 0.95);
    // // console.log("imageDataURL", imageDataURL);
    // // Convert data URL to buffer
    // const base64Data = imageDataURL.replace(/^data:image\/jpeg;base64,/, "");
    // const buffer = Buffer.from(base64Data, "base64");
    // // Write the buffer to a file
    // fs.writeFileSync("clipped_image.jpg", buffer);

    // const canvasImage1 = canvas1.toDataURL({
    //   format: "png",
    //   quality: 1,
    // });

    canvas2.loadFromJSON(parsedJson2, function () {
      canvas2.renderAll();
      cutLine = canvas2.getObjects().find((obj) => obj.type === "rect" && obj.stroke === "red");
      // canvas2.clipPath = cutLine;
      // canvas2.renderAll();

      const originalCtx2 = canvas2.getContext("2d");
      const imageData2 = originalCtx2.getImageData(
        80,
        80,
        3.625 * 200, // Width of the box
        2.125 * 200 // Height of the box
      );
      const clippedCanvas2 = new fabric.StaticCanvas(null, {
        width: 3.625 * 200,
        height: 2.125 * 200,
      });
      const clippedCtx2 = clippedCanvas2.getContext("2d");
      clippedCtx2.putImageData(imageData2, 0, 0);
      const canvasImage2 = clippedCtx2.canvas.toDataURL({
        format: "png",
        quality: 1,
      });
      // const canvasImage2 = canvas2.toDataURL({
      //   format: "png",
      //   quality: 1,
      // });
      res.json({
        canvasImage1,
        canvasImage2,
      });
    });
  });
});

router.post("/update/fit-to-design", (req, res, next) => {
  const { canvasJson } = req.body;

  //   console.log("req.body", req.body);

  var canvas = new fabric.StaticCanvas(null, {
    width: parseFloat(req.body.width) * 100,
    height: parseFloat(req.body.height) * 100,
  });
  //   console.log("type canvasJson", typeof canvasJson);

  let parsedJson = JSON.parse(canvasJson);

  canvas.loadFromJSON(parsedJson, function () {
    canvas.renderAll();
    const image = canvas.getObjects().find((obj) => obj.type === "image");

    // Get the active object
    var scaleX = canvas.width / image.width;
    var scaleY = canvas.height / image.height;

    // Apply the scaling factors to fit the object to the canvas
    image.scaleX = scaleX;
    image.scaleY = scaleY;

    // Set the position to the center of the canvas
    image.set({
      left: canvas.width / 2,
      top: canvas.height / 2,
      originX: "center",
      originY: "center",
    });

    // Apply the changes
    canvas.renderAll();
    const canvasJSON = JSON.stringify(canvas.toJSON());
    // Convert canvas to image
    const canvasImage = canvas.toDataURL({
      format: "png",
      quality: 1,
    });

    // Send response with canvas image and JSON data
    res.json({
      canvasImage,
      canvasJSON,
    });
  });
});

router.post("/update/scale-up", (req, res, next) => {
  const { canvasJson } = req.body;
  var canvas = new fabric.StaticCanvas(null, {
    width: parseFloat(req.body.width) * 100,
    height: parseFloat(req.body.height) * 100,
  });

  let parsedJson = JSON.parse(canvasJson);

  canvas.loadFromJSON(parsedJson, function () {
    canvas.renderAll();
    const image = canvas.getObjects().find((obj) => obj.type === "image");

    image.scaleX *= 1.1; // Increase by 10%
    image.scaleY *= 1.1; // Increase by 10%

    // Apply the changes
    canvas.renderAll();
    const canvasJSON = JSON.stringify(canvas.toJSON());
    // Convert canvas to image
    const canvasImage = canvas.toDataURL({
      format: "png",
      quality: 1,
    });

    // Send response with canvas image and JSON data
    res.json({
      canvasImage,
      canvasJSON,
    });
  });
});

router.post("/update/scale-down", (req, res, next) => {
  const { canvasJson } = req.body;
  var canvas = new fabric.StaticCanvas(null, {
    width: parseFloat(req.body.width) * 100,
    height: parseFloat(req.body.height) * 100,
  });

  let parsedJson = JSON.parse(canvasJson);

  canvas.loadFromJSON(parsedJson, function () {
    canvas.renderAll();
    const image = canvas.getObjects().find((obj) => obj.type === "image");

    image.scaleX /= 1.1; // Increase by 10%
    image.scaleY /= 1.1; // Increase by 10%

    // Apply the changes
    canvas.renderAll();
    const canvasJSON = JSON.stringify(canvas.toJSON());
    // Convert canvas to image
    const canvasImage = canvas.toDataURL({
      format: "png",
      quality: 1,
    });

    // Send response with canvas image and JSON data
    res.json({
      canvasImage,
      canvasJSON,
    });
  });
});

router.post("/update/rotate45", (req, res, next) => {
  const { canvasJson } = req.body;

  //   console.log("req.body", req.body);

  var canvas = new fabric.StaticCanvas(null, {
    width: parseFloat(req.body.width) * 100,
    height: parseFloat(req.body.height) * 100,
  });
  //   console.log("type canvasJson", typeof canvasJson);

  let parsedJson = JSON.parse(canvasJson);

  canvas.loadFromJSON(parsedJson, function () {
    canvas.renderAll();
    const image = canvas.getObjects().find((obj) => obj.type === "image");
    // image.set("angle", 45);
    var newAngle = (image.angle - 90) % 360;
    image.rotate(-newAngle);
    canvas.renderAll();
    const canvasJSON = JSON.stringify(canvas.toJSON());
    // Convert canvas to image
    const canvasImage = canvas.toDataURL({
      format: "png",
      quality: 1,
    });

    // Send response with canvas image and JSON data
    res.json({
      canvasImage,
      canvasJSON,
    });
  });
});

router.post("/update/move-left", (req, res, next) => {
  const { canvasJson } = req.body;

  //   console.log("req.body", req.body);

  var canvas = new fabric.StaticCanvas(null, {
    width: parseFloat(req.body.width) * 100,
    height: parseFloat(req.body.height) * 100,
  });
  //   console.log("type canvasJson", typeof canvasJson);

  let parsedJson = JSON.parse(canvasJson);

  canvas.loadFromJSON(parsedJson, function () {
    canvas.renderAll();
    const image = canvas.getObjects().find((obj) => obj.type === "image");
    // image.set("angle", 45);
    image.set({
      left: image.left - 5, // Adjust the value as needed
    });
    canvas.renderAll();
    const canvasJSON = JSON.stringify(canvas.toJSON());
    // Convert canvas to image
    const canvasImage = canvas.toDataURL({
      format: "png",
      quality: 1,
    });

    // Send response with canvas image and JSON data
    res.json({
      canvasImage,
      canvasJSON,
    });
  });
});

router.post("/update/move-right", (req, res, next) => {
  const { canvasJson } = req.body;

  //   console.log("req.body", req.body);

  var canvas = new fabric.StaticCanvas(null, {
    width: parseFloat(req.body.width) * 100,
    height: parseFloat(req.body.height) * 100,
  });
  //   console.log("type canvasJson", typeof canvasJson);

  let parsedJson = JSON.parse(canvasJson);

  canvas.loadFromJSON(parsedJson, function () {
    canvas.renderAll();
    const image = canvas.getObjects().find((obj) => obj.type === "image");
    // image.set("angle", 45);
    image.set({
      left: image.left + 5, // Adjust the value as needed
    });
    canvas.renderAll();
    const canvasJSON = JSON.stringify(canvas.toJSON());
    // Convert canvas to image
    const canvasImage = canvas.toDataURL({
      format: "png",
      quality: 1,
    });

    // Send response with canvas image and JSON data
    res.json({
      canvasImage,
      canvasJSON,
    });
  });
});

router.post("/update/move-up", (req, res, next) => {
  const { canvasJson } = req.body;

  //   console.log("req.body", req.body);

  var canvas = new fabric.StaticCanvas(null, {
    width: parseFloat(req.body.width) * 100,
    height: parseFloat(req.body.height) * 100,
  });
  //   console.log("type canvasJson", typeof canvasJson);

  let parsedJson = JSON.parse(canvasJson);

  canvas.loadFromJSON(parsedJson, function () {
    canvas.renderAll();
    const image = canvas.getObjects().find((obj) => obj.type === "image");
    // image.set("angle", 45);
    image.set({
      top: image.top - 5, // Adjust the value as needed
    });
    canvas.renderAll();
    const canvasJSON = JSON.stringify(canvas.toJSON());
    // Convert canvas to image
    const canvasImage = canvas.toDataURL({
      format: "png",
      quality: 1,
    });

    // Send response with canvas image and JSON data
    res.json({
      canvasImage,
      canvasJSON,
    });
  });
});

router.post("/update/move-down", (req, res, next) => {
  const { canvasJson } = req.body;

  //   console.log("req.body", req.body);

  var canvas = new fabric.StaticCanvas(null, {
    width: parseFloat(req.body.width) * 100,
    height: parseFloat(req.body.height) * 100,
  });
  //   console.log("type canvasJson", typeof canvasJson);

  let parsedJson = JSON.parse(canvasJson);

  canvas.loadFromJSON(parsedJson, function () {
    canvas.renderAll();
    const image = canvas.getObjects().find((obj) => obj.type === "image");
    // image.set("angle", 45);
    image.set({
      top: image.top + 5, // Adjust the value as needed
    });
    canvas.renderAll();
    const canvasJSON = JSON.stringify(canvas.toJSON());
    // Convert canvas to image
    const canvasImage = canvas.toDataURL({
      format: "png",
      quality: 1,
    });

    // Send response with canvas image and JSON data
    res.json({
      canvasImage,
      canvasJSON,
    });
  });
});

router.post("/update/remove-cutline", (req, res, next) => {
  const { canvasJson } = req.body;

  //   console.log("req.body", req.body);

  var canvas = new fabric.StaticCanvas(null, {
    width: parseFloat(req.body.width) * 100,
    height: parseFloat(req.body.height) * 100,
  });
  //   console.log("type canvasJson", typeof canvasJson);

  let parsedJson = JSON.parse(canvasJson);

  canvas.loadFromJSON(parsedJson, function () {
    canvas.renderAll();

    const cutLine = canvas
      .getObjects()
      .find((obj) => obj.type === "rect" && obj.stroke === "black");
    if (!cutLine) {
      canvas.add(getBorderRect(2, "black"));
    } else {
      canvas.remove(cutLine);
    }

    canvas.renderAll();
    const canvasJSON = JSON.stringify(canvas.toJSON());
    // Convert canvas to image
    const canvasImage = canvas.toDataURL({
      format: "png",
      quality: 1,
    });

    // Send response with canvas image and JSON data
    res.json({
      canvasImage,
      canvasJSON,
    });
  });
});

router.post("/update/remove-alllines", (req, res, next) => {
  const { canvasJson } = req.body;

  //   console.log("req.body", req.body);

  var canvas = new fabric.StaticCanvas(null, {
    width: parseFloat(req.body.width) * 100,
    height: parseFloat(req.body.height) * 100,
  });
  //   console.log("type canvasJson", typeof canvasJson);

  let parsedJson = JSON.parse(canvasJson);

  canvas.loadFromJSON(parsedJson, function () {
    canvas.renderAll();

    const blackLineOrig = canvas
      .getObjects()
      .find((obj) => obj.type === "rect" && obj.stroke === "black");

    const redLineOrig = canvas
      .getObjects()
      .find((obj) => obj.type === "rect" && obj.stroke === "black");

    const blueLineOrig = canvas
      .getObjects()
      .find((obj) => obj.type === "rect" && obj.stroke === "black");

    if (!redLineOrig && !blueLineOrig) {
      const blackLine = getBorderRect(2, "black");
      const redLine = getBorderRect(10, "red");
      const blueLine = getBorderRect(20, "blue");
      canvas.add(blackLine);
      canvas.add(redLine);
      canvas.add(blueLine);
    } else {
      canvas.remove();
    }

    canvas.renderAll();
    const canvasJSON = JSON.stringify(canvas.toJSON());
    // Convert canvas to image
    const canvasImage = canvas.toDataURL({
      format: "png",
      quality: 1,
    });

    // Send response with canvas image and JSON data
    res.json({
      canvasImage,
      canvasJSON,
    });
  });
});

module.exports = router;
