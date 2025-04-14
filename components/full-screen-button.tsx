import { Fullscreen } from "lucide-react";

function FullScreenButton() {
  function toggleFullScreen() {
    if (!document.fullscreenElement) {
      // Entrar em tela cheia
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if ((elem as any).webkitRequestFullscreen) {
        (elem as any).webkitRequestFullscreen();
      } else if ((elem as any).msRequestFullscreen) {
        (elem as any).msRequestFullscreen();
      }
    } else {
      // Sair da tela cheia
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
  }

  return (
    <Fullscreen onClick={toggleFullScreen} className="pl-2 cursor-pointer" />
  );
}

export default FullScreenButton;
