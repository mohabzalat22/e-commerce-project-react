import React from "react";

const footerLinks: Record<string, string[]> = {
  Account: ["Log In", "Sign Up", "Preferences", "Request a Gift Card"],
  Company: [
    "About",
    "Environmental",
    "Factories",
    "HR",
    "Careers",
    "International",
    "Accessibility",
  ],
  "Get Help": [
    "Help Center",
    "Returns & Policy",
    "Shipping Info",
    "Size Guide",
    "Back Order",
  ],
  Connect: ["Facebook", "Instagram", "Twitter", "Pinterest", "Our Stories"],
};

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="max-w-shell mx-auto px-6 py-12">
        <div className="grid grid-cols-5 gap-8">
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-xs font-semibold tracking-widest uppercase text-gray-800 mb-4">
                {heading}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="/"
                      className="text-xs text-gray-500 hover:text-gray-800 transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-gray-800 mb-4">
              Stay Updated
            </h4>
            <div className="flex border border-gray-300 overflow-hidden">
              <input
                type="email"
                placeholder="Enter email"
                className="flex-1 px-3 py-2 text-xs text-gray-700 outline-none placeholder:text-gray-400"
              />
              <button
                className="bg-gray-900 text-white px-4 py-2 flex items-center justify-center hover:bg-gray-700 transition"
                title="Send"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.40,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 L4.13399899,1.15670701 C3.50612381,-0.1 2.40,0.0570974495 1.77946707,0.52 C0.994623095,1.1 0.837654326,2.0429435 1.15159189,2.98435971 L3.03521743,9.42535275 C3.03521743,9.58245014 3.34915502,9.73954753 3.50612381,9.73954753 L16.6915026,10.5250344 C16.6915026,10.5250344 17.1624089,10.5250344 17.1624089,11 C17.1624089,11.4715 16.6915026,12.4744748 16.6915026,12.4744748 Z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-4">
            {[
              "Privacy Policy",
              "Terms of Service",
              "Do Not Sell or Share My Personal Info",
              "Supply Chain Transparency",
            ].map((item) => (
              <a
                key={item}
                href="/"
                className="text-[10px] text-gray-400 hover:text-gray-600 transition"
              >
                {item}
              </a>
            ))}
          </div>
          <p className="text-[10px] text-gray-400">
            © 2026 MIS EAGLES. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
