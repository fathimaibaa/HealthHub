import React from 'react';
import logo from '../../../Assets/Images/logo.png';

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
  },
];

const currentYear = new Date().getFullYear();

const Footer: React.FC = () => {
  return (
    <footer className="relative w-full m-2">
      <div className="mx-auto w-full max-w-7xl px-8 border-t border-blue-gray-100 pt-8">
        <div className="grid grid-cols-1 justify-between gap-4 md:grid-cols-2">
          <div className="mb-6">
            <img src={logo} alt="HealthHub Logo" className="h-10 inline-block" />
            <span className="text-2xl font-semibold m-3">HealthHub</span>
          </div>

          <div className="grid grid-cols-3 justify-between gap-4">
            {LINKS.map(({ title, items }) => (
              <ul key={title}>
                <span className="mb-3 font-medium opacity-40 text-sm text-blue-gray-600">
                  {title}
                </span>
                {items.map((link) => (
                  <li key={link}>
                    <a href="#" className="py-1.5 font-normal transition-colors hover:text-purple-700 text-gray-700">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>

        <div className="mt-12 flex w-full flex-col items-center justify-center border-t border-blue-gray-50 py-4 md:flex-row md:justify-between">
          <span className="mb-4 text-center font-normal text-sm text-blue-gray-900 md:mb-0">
            &copy; {currentYear} HealthHub. All Rights Reserved.
          </span>

          <div className="flex gap-4 text-blue-gray-900 sm:justify-center">
            <a href="#" className="opacity-80 transition-opacity hover:opacity-100"></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
