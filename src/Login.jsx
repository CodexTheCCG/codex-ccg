import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/scanner");
  };

 return (
    <div style={styles.container}>
      <div style={styles.buttonWrapper}>
        <button style={styles.button} onClick={handleLogin}>
          Log In
        </button>
      </div>
    </div>
  );
}

const styles = {
    container: {
  backgroundImage: 'url("/login-bg.jpg")',
  backgroundSize: "150%",
  backgroundPosition: "top center",
  backgroundRepeat: "no-repeat",
  backgroundColor: "#000",
  height: "100vh",
  width: "100vw",
  position: "relative", // key line to allow absolute positioning
},

buttonWrapper: {
  position: "absolute",         // lock to screen edge
  bottom: "30px",               // 30px from bottom
  left: "50%",                  // center horizontally
  transform: "translateX(-50%)", // shift left by 50% of its own width
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  padding: "12px 24px",
  borderRadius: "8px",
},

  button: {
    fontSize: "1.1rem",
    padding: "12px 32px",
    borderRadius: "8px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};