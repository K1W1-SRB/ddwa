"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const HomePage = () => {
  const router = useRouter();
  const [user, setUser] = useState<{ username: string } | null>(null);

  useEffect(() => {
    // Check if window is defined (this is client-side rendering check)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("jwt_token");

      if (token) {
        console.log(token);
        // Fetch the user details from the server if token exists
        axios
          .get("http://localhost:8080/auth-v2/me", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            setUser(response.data); // Ensure your API response includes 'username'
          })
          .catch((error) => {
            console.error("Error fetching user info:", error);
            setUser(null); // Clear user in case of error
          });
      } else {
        setUser(null); // No token, clear user info
      }
    }
  }, []); // Runs only once when the component mounts

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
        <div className="text-2xl font-bold">ALBA CRUISE</div>
        <div className="flex space-x-4">
          <button
            onClick={() => router.push("/")}
            className="hover:bg-gray-700 px-3 py-2 rounded-md"
          >
            Home
          </button>
          <button
            onClick={() => router.push("/Booking")}
            className="hover:bg-gray-700 px-3 py-2 rounded-md"
          >
            Book
          </button>
          <button
            onClick={() => router.push("/tour")}
            className="hover:bg-gray-700 px-3 py-2 rounded-md"
          >
            Tour
          </button>
          {user ? (
            <button
              onClick={handleLogout}
              className="hover:bg-gray-700 px-3 py-2 rounded-md"
            >
              {user.username}
            </button>
          ) : (
            <button
              onClick={() => router.push("/login")}
              className="hover:bg-gray-700 px-3 py-2 rounded-md"
            >
              Login
            </button>
          )}
        </div>
      </nav>

      <section
        className="flex flex-1 justify-center items-center bg-cover bg-center h-96 relative"
        style={{ backgroundImage: "url('/path-to-your-image.jpg')" }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="text-center text-white z-10">
          <h1 className="text-5xl font-bold mb-4">ALBA CRUISE</h1>
          <p className="text-xl">
            We are the leading supplier to help you travel around the beautiful
            island of Scotland
          </p>
        </div>
      </section>

      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>&copy; 2024 ALBA Cruises. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
