const convertBase64ToFile = (base64: string, fileName: string): File => {
    const [header, data] = base64.split(",");
    const cappedHeader = header.slice(0, 100);
    const mimeMatch = /^data:([a-zA-Z0-9+./-]+);base64$/.exec(cappedHeader);
    const mime = mimeMatch ? mimeMatch[1] : "";
  
    const binary = atob(data);
    const len = binary.length;
    const u8arr = new Uint8Array(len);
  
    for (let i = 0; i < len; i++) {
      u8arr[i] = binary.charCodeAt(i);
    }
  
    return new File([u8arr], fileName, { type: mime });
  };
  export default convertBase64ToFile;  