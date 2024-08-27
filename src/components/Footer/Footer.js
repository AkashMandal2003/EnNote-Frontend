import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-headerColor py-6 lg:py-2  min-h-28 z-50  relative">
      <div className="xl:px-10 sm:px-6 px-4  min-h-28  flex lg:flex-row flex-col  lg:gap-0 gap-5  justify-between items-center ">
        <ul className="flex flex-1  md:gap-6 gap-4   text-white flex-row items-center ">
          <li>
            <Link to="/about">
              <span className="hover:underline">About Us</span>
            </Link>
          </li>
          <li>
            <Link to="/">
              <span className="hover:underline">Services</span>
            </Link>
          </li>
          <li>
            <Link to="/contact">
              <span className="hover:underline">Contact</span>
            </Link>
          </li>
          <li>
            <Link to="/">
              <span className="hover:underline">Privacy Policy</span>
            </Link>
          </li>
        </ul>

        <p className="w-fit  flex items-center text-white text-sm">
          <span>&copy;{currentYear} EnNote | All rights reserved.</span>
        </p>

        <div className="flex-1  flex flex-row gap-6 lg:justify-end justify-start items-center">
          <Link
            className="text-white border h-10 w-10 flex justify-center items-center border-white rounded-full p-2 hover:bg-blue-600 transition-colors duration-300"
            to="https://facebook.com"
            target="_blank"
          >
            <FaFacebookF width={20} height={20} />
          </Link>{" "}
          <Link
            className="text-white border h-10 w-10 flex justify-center items-center border-white rounded-full p-2 hover:bg-blue-600 transition-colors duration-300"
            to="https://www.linkedin.com/in/akashmandal2003/"
            target="_blank"
          >
            <FaLinkedinIn width={20} height={20} />
          </Link>{" "}
          <Link
            className="text-white border h-10 w-10 flex justify-center items-center border-white rounded-full p-2 hover:bg-blue-600 transition-colors duration-300"
            to="https://twitter.com"
            target="_blank"
          >
            <FaTwitter width={20} height={20} />
          </Link>{" "}
          <Link
            className="text-white border h-10 w-10 flex justify-center items-center border-white rounded-full p-2 hover:bg-blue-600 transition-colors duration-300"
            to="https://www.instagram.com/_https.akaash/"
            target="_blank"
          >
            <FaInstagram width={20} height={20} />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
