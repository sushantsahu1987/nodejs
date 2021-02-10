const usb = require("usb");

const devices = usb.getDeviceList();

devices.forEach((device, index) => {
  device.open();
  device.getStringDescriptor(
    device.deviceDescriptor.iManufacturer,
    function (err, manufacturer) {
      device.getStringDescriptor(
        device.deviceDescriptor.iProduct,
        function (err, product) {
          device.getStringDescriptor(
            device.deviceDescriptor.iSerialNumber,
            function (err, serialNumber) {
              console.log(manufacturer, product, serialNumber);
              device.close();
            }
          );
        }
      );
    }
  );

  // console.log("index = ",index);
  // console.log(d.configDescriptor);
  // console.log(d.allConfigDescriptors);

  // d.allConfigDescriptors.forEach(config => {
  //     console.log(config.extra.toString("utf-8"));
  // });

  // console.log("interfaces");
  //   d.configDescriptor.interfaces.forEach((f) => {
  //     f.forEach((item) => {
  //     //   console.log(item);
  //       console.log(item.extra.toString("ascii"));
  //     });
  //   });
  // console.log(d.deviceDescriptor);
  //   d.open();
  //   d.getStringDescriptor(
  //     d.deviceDescriptor.iManufacturer,
  //     (error1, manufacturer) => {
  //       if (error1) {
  //         console.log(error1);
  //         d.close();
  //       }
  //       d.getStringDescriptor(d.deviceDescriptor.iProduct, (error2, product) => {
  //         if (error2) {
  //           console.log(error2);
  //           d.close();
  //         }
  //         // console.log('manufacturer ', manufacturer);
  //         // console.log('producr ', product);

  //         d.getStringDescriptor(
  //           d.deviceDescriptor.bcdUSB,
  //           (error3, bcdDevice) => {
  //             if (error3) {
  //               console.log(error3);
  //               d.close();
  //             }
  //             console.log("manufacturer ", manufacturer);
  //             console.log("producr ", product);
  //             console.log("bcdDevice ", bcdDevice);
  //           }
  //         );
  //       });
  //     }
  //   );
});
