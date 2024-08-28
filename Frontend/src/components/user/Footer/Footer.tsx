import React from 'react';
import { Typography } from "@material-tailwind/react";
import logo from '../../../assets/images/logo.png';

const LINKS = [
  {
      title: "Important Links",
      items: ["Appointment", "Doctors", "Services", "About us"],
  },
  {
      title: "Contact us",
      items: ["Call: +91-8089578682", "Email: HealthHub@gmail.com", "India"],
  },
  {
      title: "Resource",
      items: ["Blog", "Newsletter", "Events", "Help center"],
  }
];

const currentYear = new Date().getFullYear();

const Footer: React.FC = () => {
  return (
    <footer className="relative w-full m-2">
      <div className="mx-auto w-full max-w-7xl px-8 border-t border-blue-gray-100 pt-8">
        <div className="grid grid-cols-1 justify-between gap-4 md:grid-cols-2">
          
          <Typography variant="h5" className="mb-6">
          <img src={logo} alt="HealthHub Logo" className=" h-10 inline-block " /><span className = "text-2xl font-semibold m-3">HealthHub</span> 
          </Typography>
          <div className="grid grid-cols-3 justify-between gap-4">
            {LINKS.map(({ title, items }) => (
              <ul key={title}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-3 font-medium opacity-40"
                >
                  {title}
                </Typography>
                {items.map((link) => (
                  <li key={link}>
                    <Typography
                      as="a"
                      href="#"
                      color="gray"
                      className="py-1.5 font-normal transition-colors hover:text-purple-700"
                    >
                      {link}
                    </Typography>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
        <div className="mt-12 flex w-full flex-col items-center justify-center border-t border-blue-gray-50 py-4 md:flex-row md:justify-between">
          <Typography
            variant="small"
            className="mb-4 text-center font-normal text-blue-gray-900 md:mb-0"
          >
            &copy; {currentYear} <a href="https://material-tailwind.com/">HealthHub</a>. All
            Rights Reserved.
          </Typography>
          <div className="flex gap-4 text-blue-gray-900 sm:justify-center">
            <Typography as="a" href="#" className="opacity-80 transition-opacity hover:opacity-100">
            </Typography>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
