__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   generateRandomId: () => (/* binding */ generateRandomId)
/* harmony export */ });
function generateRandomId(len) {
  const chars = 'abcdefghijklmnopqrstuvwxyz1234567890';

  let res = '';
  while (len--) {
    const random = Math.random();
    res += chars.charAt(random * chars.length);
  }

  return res;
}


//# sourceURL=webpack://rswebclient/./src/lib/webrtc/utils.js?