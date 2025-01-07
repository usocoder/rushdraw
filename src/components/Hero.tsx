import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <div className="relative overflow-hidden py-20 px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            <span className="text-primary">Rush</span>Drop
          </h1>
          <p className="mt-6 text-lg leading-8 text-secondary">
            Open cases and win amazing prizes. From budget-friendly to premium cases,
            there's something for everyone.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="#cases"
              className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-accent transition-colors duration-300"
            >
              Explore Cases
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};