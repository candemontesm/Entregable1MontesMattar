export const toast = (text, type = "info") => {
  const colors = {
    info: "var(--primary)",
    success: "linear-gradient(90deg, #4BB543, #3B9140)",
    error: "linear-gradient(90deg, #D64545, #B73232)",
  };
  Toastify({
    text,
    duration: 2500,
    style: {
      background: colors[type],
      color: type === "info" ? "#000" : "#fff",
    },
  }).showToast();
};
