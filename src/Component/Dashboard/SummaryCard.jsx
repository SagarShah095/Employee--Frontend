import React from "react";
import { FaBuilding, FaMoneyBillWave } from "react-icons/fa";
import { IoIosPaper } from "react-icons/io";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { MdOutlineTimer } from "react-icons/md";
import { MdCancel } from "react-icons/md";

const SummaryCard = ({ icon, text, number }) => {
  return (
    <div>
      <div className="flex justify-between items-center gap-4 p-4 bg-gray-100 rounded-lg mb-4">
        <div className="rounded flex w-full bg-white">
          <div className="text-3xl flex justify-center items-center bg-teal-600 text-white px-4">
            {icon}
          </div>
          <div className="pl-4 py-1">
            <p className="text-lg font-semibold">{text}</p>
            <p className="text-xl font-bold">{number}</p>
          </div>
        </div>
        <div className="rounded flex w-full bg-white">
          <div className="text-3xl flex justify-center items-center bg-yellow-600 text-white px-4">
            <FaBuilding />
          </div>
          <div className="pl-4 py-1">
            <p className="text-lg font-semibold">Total Departments</p>
            <p className="text-xl font-bold">3</p>
          </div>
        </div>
        <div className="rounded flex w-full bg-white">
          <div className="text-3xl flex justify-center items-center bg-red-600 text-white px-4">
            <FaMoneyBillWave />
          </div>
          <div className="pl-4 py-1">
            <p className="text-lg font-semibold">Monthly Pay</p>
            <p className="text-xl font-bold">$2500</p>
          </div>
        </div>
      </div>

      <div>
        <div className="text-lg font-semibold ml-4 mt-4">
          <h1 className="text-2xl mb-5">Leave Details</h1>
        </div>
        <div className="flex gap-7 ml-4">
          <div className="rounded flex pr-28 bg-white w-full">
            <div className="text-3xl flex justify-center items-center bg-teal-600 text-white px-4">
              <IoIosPaper />
            </div>
            <div className="pl-4 py-1">
              <p className="text-lg font-semibold">Leave Applied</p>
              <p className="text-xl font-bold">5</p>
            </div>
          </div>
          <div className="rounded flex pr-28 w-full bg-white">
            <div className="text-3xl flex justify-center items-center bg-green-600 text-white px-4">
              <IoIosCheckmarkCircleOutline />
            </div>
            <div className="pl-4 py-1">
              <p className="text-lg font-semibold">Leave Approved</p>
              <p className="text-xl font-bold">2</p>
            </div>
          </div>
        </div>
        <div className="flex gap-7 mt-5 ml-4">
          <div className="rounded w-full flex pr-28 bg-white">
            <div className="text-3xl flex justify-center items-center bg-yellow-600 text-white px-4">
              <MdOutlineTimer />
            </div>
            <div className="pl-4 py-1">
              <p className="text-lg font-semibold">Leave Pending</p>
              <p className="text-xl font-bold">4</p>
            </div>
          </div>
          <div className="rounded w-full flex pr-28 bg-white">
            <div className="text-3xl flex justify-center items-center bg-red-600 text-white px-4">
              <MdCancel />
            </div>
            <div className="pl-4 py-1">
              <p className="text-lg font-semibold">Leave Rejected</p>
              <p className="text-xl font-bold">1</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
