import toast from "react-hot-toast";

export const durationInMinutes = (songDuration: number) => {
  const minutes = Math.floor(songDuration / 60);
  const seconds = Math.floor(songDuration % 60);
  const duration = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  return duration;
};

export const createToast = (state: string, contents: string) => {
  const toastStyling = {
    style: {
      borderRadius: "8px",
      background: "#333",
      color: "#fff",
    },
    duration: 4000,
  };
  switch (state) {
    case "error":
      return toast.error(contents, toastStyling);
    case "success":
      return toast.success(contents, toastStyling);
    default:
      break;
  }
};
