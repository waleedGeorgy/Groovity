import toast from "react-hot-toast";

export const durationInMinutes = (songDuration: number) => {
  const minutes = Math.floor(songDuration / 60);
  const seconds = Math.floor(songDuration % 60);
  const duration = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  return duration;
};

export const createToast = (state: string, contents: string) => {
  switch (state) {
    case "error":
      return toast.error(contents, {
        style: {
          borderRadius: "8px",
          background: "#333",
          color: "#fff",
        },
        duration: 4000,
      });
    case "success":
      return toast.success(contents, {
        style: {
          borderRadius: "8px",
          background: "#333",
          color: "#fff",
        },
        duration: 4000,
      });
    default:
      break;
  }
};
