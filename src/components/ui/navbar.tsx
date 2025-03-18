
import { Link } from "react-router-dom";
import { Button } from "./button";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./navigation-menu";
import { cn } from "@/lib/utils";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              DevProp Industries NZ
            </span>
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/about">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    About
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Modules</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {[...Array(13)].map((_, i) => (
                      <li key={i} className="row-span-1">
                        <NavigationMenuLink asChild>
                          <Link
                            to={`/module/${i}`}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">
                              {i === 0 ? "Introduction" : `Module ${i}`}
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile menu button */}
        <button
          className="inline-flex items-center justify-center rounded-md text-sm font-medium md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="sr-only">Toggle menu</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="absolute top-14 left-0 right-0 bg-background border-b border-border z-50 md:hidden">
            <div className="flex flex-col space-y-4 p-4">
              <Link
                to="/"
                className="text-foreground hover:text-accent"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-foreground hover:text-accent"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/modules"
                className="text-foreground hover:text-accent"
                onClick={() => setIsMenuOpen(false)}
              >
                Modules
              </Link>
            </div>
          </div>
        )}

        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button asChild>
            <Link to="/login">Login</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
