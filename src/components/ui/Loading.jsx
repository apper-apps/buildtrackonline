import { motion } from "framer-motion";

const Loading = ({ type = "timeline" }) => {
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const shimmerVariants = {
    initial: { backgroundPosition: "-200px 0" },
    animate: { 
      backgroundPosition: "200px 0",
      transition: { 
        repeat: Infinity,
        duration: 1.5,
        ease: "easeInOut"
      }
    }
  };

  if (type === "timeline") {
    return (
      <motion.div
        className="space-y-4 p-6"
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <motion.div
            className="h-8 w-48 bg-gradient-to-r from-secondary-100 via-secondary-200 to-secondary-100 rounded-lg"
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            style={{ backgroundSize: "400px 100%" }}
          />
          <motion.div
            className="h-10 w-32 bg-gradient-to-r from-secondary-100 via-secondary-200 to-secondary-100 rounded-lg"
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            style={{ backgroundSize: "400px 100%" }}
          />
        </div>

        {/* Timeline skeleton */}
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <motion.div
                className="h-12 w-32 bg-gradient-to-r from-secondary-100 via-secondary-200 to-secondary-100 rounded-lg"
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                style={{ 
                  backgroundSize: "400px 100%",
                  animationDelay: `${i * 0.1}s`
                }}
              />
              <div className="flex-1 space-x-2 flex">
                {[...Array(5)].map((_, j) => (
                  <motion.div
                    key={j}
                    className="h-8 bg-gradient-to-r from-primary-100 via-primary-200 to-primary-100 rounded"
                    style={{ 
                      width: `${Math.random() * 100 + 50}px`,
                      backgroundSize: "400px 100%",
                      animationDelay: `${(i * 5 + j) * 0.05}s`
                    }}
                    variants={shimmerVariants}
                    initial="initial"
                    animate="animate"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  if (type === "cards") {
    return (
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6"
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {[...Array(9)].map((_, i) => (
          <motion.div
            key={i}
            className="bg-white rounded-xl shadow-soft p-6 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { delay: i * 0.1 }
            }}
          >
            <motion.div
              className="h-6 w-3/4 bg-gradient-to-r from-secondary-100 via-secondary-200 to-secondary-100 rounded"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={{ backgroundSize: "400px 100%" }}
            />
            <motion.div
              className="h-4 w-full bg-gradient-to-r from-secondary-100 via-secondary-200 to-secondary-100 rounded"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={{ backgroundSize: "400px 100%" }}
            />
            <motion.div
              className="h-4 w-2/3 bg-gradient-to-r from-secondary-100 via-secondary-200 to-secondary-100 rounded"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={{ backgroundSize: "400px 100%" }}
            />
            <div className="flex justify-between items-center">
              <motion.div
                className="h-8 w-20 bg-gradient-to-r from-accent-100 via-accent-200 to-accent-100 rounded-full"
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                style={{ backgroundSize: "400px 100%" }}
              />
              <motion.div
                className="h-8 w-24 bg-gradient-to-r from-primary-100 via-primary-200 to-primary-100 rounded"
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                style={{ backgroundSize: "400px 100%" }}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex items-center justify-center py-12"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="text-center space-y-4">
        <motion.div
          className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.p
          className="text-secondary-600 font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          Loading...
        </motion.p>
      </div>
    </motion.div>
  );
};

export default Loading;