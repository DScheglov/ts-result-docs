function decodeBase64(base64) {
  const binString = atob(decodeURIComponent(base64));
  return new TextDecoder().decode(Uint8Array.from(binString, (m) => m.codePointAt(0)));
}

function encodeBase64(str) {
  const bytes = new TextEncoder().encode(str);
  const binString = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join("");
  return encodeURIComponent(btoa(binString));
}