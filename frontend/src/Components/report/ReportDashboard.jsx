import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import AdminSideBar from '../../shared/AdminSideBar'; // Assuming it's already implemented
import axios from 'axios'; // For making API requests

// Chart.js modules
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Title } from 'chart.js';

// Register chart modules
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title);

const DataAndReports = () => {
  const [chartData, setChartData] = useState({
    labels: ['8 - 10', '10 - 12', '12 - 14', '14 - 16', '16 - 18'],
    datasets: [
      {
        label: 'Number of Patients',
        data: [0, 0, 0, 0, 0], // Default data
        fill: false,
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  });

  // Fetch data from backend API
  useEffect(() => {
    const fetchAppointmentData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/appointments/time-slot-analysis');
        const appointments = response.data;
        console.log(appointments);

        // Map time slots to their corresponding labels
        const timeSlotMap = {
          '8 - 10': 0,
          '10:00-11:00AM': 1, // Ensure this matches your response
          '12 - 14': 2,
          '14 - 16': 3,
          '16 - 18': 4,
        };

        // Create an array to store appointment counts
        const appointmentCounts = [0, 0, 0, 0, 0];

        // Fill the appointment counts based on the timeSlot
        appointments.forEach((appointment) => {
          const index = timeSlotMap[appointment._id]; // Match _id to your time slots
          if (index !== undefined) {
            appointmentCounts[index] = appointment.count; // Reflect the count
          }
        });

        console.log('Appointment Counts:', appointmentCounts); // Log the counts for debugging

        // Update chart data
        setChartData((prevData) => ({
          ...prevData,
          datasets: [
            {
              ...prevData.datasets[0],
              data: appointmentCounts,
            },
          ],
        }));
      } catch (error) {
        console.error('Error fetching appointment data:', error);
      }
    };

    fetchAppointmentData();
  }, []);

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        min: 0, // Ensure minimum is zero
        max: Math.max(...chartData.datasets[0].data) + 10, // Set max based on data
      },
    },
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <AdminSideBar />

      <div className="flex-1 p-8 pl-20">
        <h1 className="text-[40px] font-bold text-start">
          Medi<span className="text-blue-500">Care</span>
        </h1>

        {/* Peak Time Analysis Section */}
        <div className="mt-6 flex flex-col md:flex-row justify-between">
          <div className="w-full md:w-2/3">
            <h2 className="text-lg font-semibold mb-4 text-start">Peak Time Analysis</h2>
            <Line data={chartData} options={chartOptions} />
          </div>

          {/* Financial Reports Section */}
          <div className="w-full md:w-1/3 mt-8 md:mt-0 md:ml-8">
            <h2 className="text-lg font-semibold mb-4">Financial Reports</h2>
            <div className="bg-gray-100 p-4 rounded-md shadow-md">
              <p>Total Appointments: <span className="font-semibold">450</span></p>
              <p>Today's Income: <span className="font-semibold">125,000</span></p>
              <p>Total Patient Visits: <span className="font-semibold">125</span></p>
            </div>
            <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md">
              View Monthly Report
            </button>

            {/* Payment History */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold">Payment History</h3>
              <div className="space-y-4">
                {Array(3).fill().map((_, index) => (
                  <div key={index} className="bg-gray-100 p-4 rounded-md shadow-md">
                    <p>Payment ID: <span className="font-semibold">#450</span></p>
                    <p>Patient ID: <span className="font-semibold">#001</span></p>
                    <p>Patient Name: <span className="font-semibold">Adam Perera</span></p>
                    <p>Appointment ID: <span className="font-semibold">#989</span></p>
                    <p>Date: <span className="font-semibold">24/02/2024</span></p>
                    <p>Amount: <span className="font-semibold text-blue-500">Rs. 6500</span></p>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md">
                View Payment History
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataAndReports;
