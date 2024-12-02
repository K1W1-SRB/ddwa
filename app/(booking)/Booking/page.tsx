"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactSwitch from "react-switch";
import { useRouter } from "next/navigation";

function Booking() {
  const router = useRouter();

  const [bookingDate, setBookingDate] = useState(new Date());
  const [disability, setDisability] = useState(false);
  const [booked_Trip, setBookedTrip] = useState(0);
  const [No_people, setNoPeople] = useState(1);
  const [price, setPrice] = useState(0);
  const [isClient, setIsClient] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // User details from API
  const [userId, setUserId] = useState<number | null>(null);
  const [username, setUsername] = useState<string | null>("");

  // Ensure this component only runs client-side
  useEffect(() => {
    // Check if window is defined (this is client-side rendering check)
    if (typeof window !== "undefined") {
      setIsClient(true); // Set isClient to true to indicate client-side rendering

      const token = localStorage.getItem("jwt_token");

      if (token) {
        console.log(token);
        // Fetch the user details from the server if token exists
        axios
          .get("http://localhost:8080/auth-v2/me", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            // Set the user data based on API response
            const { userId, username } = response.data;
            setUserId(userId);
            setUsername(username);
          })
          .catch((error) => {
            console.error("Error fetching user info:", error);
            setUserId(null);
            setUsername(null); // Clear user info in case of error
          });
      } else {
        setUserId(null); // No token, clear user info
        setUsername(null);
      }
    }
  }, []); // Runs only once when the component mounts

  const handleSwitchChange = (checked: boolean) => {
    setDisability(checked);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare the booking data
    const bookingData = {
      userId, // Should be a number, will be converted to string for query params
      username, // Nullable string
      booked_Trip, // Number
      No_people, // Number
      price, // Number
      disability, // Boolean
      booking_date: bookingDate.toISOString(), // Convert Date to string
    };

    try {
      // Example API call for booking
      const response = await axios.post(
        "http://localhost:8080/bookings",
        bookingData
      );
      setSuccess(response.data.message || "Booking successful!");

      // Redirect to payment page with query parameters
      router.push(
        `/payment?userId=${encodeURIComponent(
          userId
        )}&username=${encodeURIComponent(
          username || ""
        )}&bookedTrip=${encodeURIComponent(
          booked_Trip
        )}&noPeople=${encodeURIComponent(No_people)}&price=${encodeURIComponent(
          price
        )}&bookingDate=${encodeURIComponent(bookingDate.toISOString())}`
      );
    } catch (err) {
      console.error("Error:", err);
      setError("Booking failed");
    }
  };
  if (!isClient) return null; // Only render on the client-side

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold text-center mb-6">Booking Form</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Booking Date and Time:
          </label>
          <DatePicker
            selected={bookingDate}
            onChange={(date) => setBookingDate(date)}
            showTimeSelect
            dateFormat="Pp"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Booked Trip :
          </label>
          <input
            type="number"
            value={booked_Trip}
            onChange={(e) => setBookedTrip(Number(e.target.value))}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            No. of People:
          </label>
          <input
            type="number"
            value={No_people}
            onChange={(e) => setNoPeople(Number(e.target.value))}
            min="1"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Price:
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="mb-4 flex items-center">
          <label className="block text-sm font-medium text-gray-700 mr-2">
            Disability:
          </label>
          <ReactSwitch
            checked={disability}
            onChange={handleSwitchChange}
            offColor="#888"
            onColor="#0d6efd"
            offHandleColor="#fff"
            onHandleColor="#fff"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default Booking;
