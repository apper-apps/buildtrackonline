import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ message = "Something went wrong", onRetry, type = "general" }) => {
  const getErrorIcon = () => {
    switch (type) {
      case "network":
        return "WifiOff";
      case "notFound":
        return "Search";
      case "permission":
        return "Lock";
      default:
        return "AlertTriangle";
    }
  };

  const getErrorTitle = () => {
    switch (type) {
      case "network":
        return "Connection Problem";
      case "notFound":
        return "Not Found";
      case "permission":
        return "Access Denied";
      default:
        return "Oops! Something went wrong";
    }
  };

  const getErrorDescription = () => {
    switch (type) {
      case "network":
        return "Unable to connect to the server. Please check your internet connection.";
      case "notFound":
        return "The resource you're looking for doesn't exist or has been moved.";
      case "permission":
        return "You don't have permission to access this resource.";
      default:
        return "We encountered an unexpected error. Please try again.";
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-20 h-20 bg-gradient-to-br from-error-100 to-error-200 rounded-full flex items-center justify-center mb-6"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      >
        <ApperIcon 
          name={getErrorIcon()} 
          className="w-10 h-10 text-error-600" 
        />
      </motion.div>

      <motion.h3
        className="text-2xl font-bold text-secondary-900 mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {getErrorTitle()}
      </motion.h3>

      <motion.p
        className="text-secondary-600 mb-2 max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {getErrorDescription()}
      </motion.p>

      {message && message !== "Something went wrong" && (
        <motion.p
          className="text-sm text-error-600 bg-error-50 px-4 py-2 rounded-lg mb-6 max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {message}
        </motion.p>
      )}

      <motion.div
        className="flex flex-col sm:flex-row gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {onRetry && (
          <Button
            onClick={onRetry}
            className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
          >
            <ApperIcon name="RefreshCw" className="w-4 h-4" />
            <span>Try Again</span>
          </Button>
        )}
        
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="border-2 border-secondary-300 text-secondary-700 hover:bg-secondary-50 px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
        >
          <ApperIcon name="RotateCcw" className="w-4 h-4" />
          <span>Reload Page</span>
        </Button>
      </motion.div>

      <motion.div
        className="mt-8 text-xs text-secondary-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Error ID: {Math.random().toString(36).substr(2, 9)}
      </motion.div>
    </motion.div>
  );
};

export default Error;