export function decodeBase64(base64: string) {
  const binString = atob(decodeURIComponent(base64));
  return new TextDecoder().decode(Uint8Array.from(binString, (m) => m.codePointAt(0)!));
}

export function encodeBase64(str: string) {
  const bytes = new TextEncoder().encode(str);
  const binString = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join("");
  return encodeURIComponent(btoa(binString));
}