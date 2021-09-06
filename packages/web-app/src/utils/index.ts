/**
 * @description download
 */
const webDownload = (filename: string, file: string | Blob | Buffer) => {
    const aLink = document.createElement("a") as HTMLAnchorElement;
    const body = document.querySelector("body");
    const fileBlob = new Blob([file]);
    aLink.href = window.URL.createObjectURL(fileBlob);
    aLink.download = filename;
    aLink.style.display = "none";
    body.appendChild(aLink);
    aLink.click();
    body.removeChild(aLink);
    window.URL.revokeObjectURL(aLink.href);
};
