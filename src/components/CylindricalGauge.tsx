import { motion } from "framer-motion";

interface CylindricalGaugeProps {
  percentage: number;
}

const CylindricalGauge = ({ percentage }: CylindricalGaugeProps) => {
  const clampedPercentage = Math.max(0, Math.min(100, percentage));
  const isFull = clampedPercentage >= 100;

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-xs mx-auto">
      <div className="relative w-40 h-80 perspective-1000">
        {/* Cylinder container */}
        <div className="relative w-full h-full">
          {/* Top ellipse */}
          <div className="absolute top-0 left-0 right-0 h-12 rounded-[50%] bg-[#] border-2 border-border" 
               style={{ transform: 'rotateX(60deg)' }} />
          
          {/* Cylinder body - background */}
          <div className="absolute top-6 left-0 right-0 bottom-6 bg-gradient-to-b from-muted to-muted/80 border-x-2 border-border" />
          
          {/* Fill container */}
          <div className="absolute top-6 left-0 right-0 bottom-6 overflow-hidden">
            <motion.div 
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-b from-primary via-primary to-primary/80"
              style={{ 
                height: `${clampedPercentage}%`,
              }}
              initial={{ height: 0 }}
              animate={{ height: `${clampedPercentage}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {/* Shine effect on fill */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              
              {/* Wave effect when full */}
              {isFull && (
                <>
                  <motion.div
                    className="absolute top-0 left-0 right-0 h-4 bg-primary/60"
                    style={{
                      borderRadius: '50%',
                    }}
                    animate={{
                      y: [-2, 2, -2],
                      scaleX: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.div
                    className="absolute top-0 left-0 right-0 h-4 bg-primary/40"
                    style={{
                      borderRadius: '50%',
                    }}
                    animate={{
                      y: [2, -2, 2],
                      scaleX: [1.05, 1, 1.05],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5,
                    }}
                  />
                </>
              )}
            </motion.div>
          </div>
          
          {/* Bottom ellipse */}
          <div className="absolute bottom-0 left-0 right-0 h-12 rounded-[50%] bg-muted border-2 border-border" 
               style={{ transform: 'rotateX(-60deg)' }} />
          
          {/* Overlay borders */}
          <div className="absolute top-6 bottom-6 left-0 w-0.5 bg-border" />
          <div className="absolute top-6 bottom-6 right-0 w-0.5 bg-border" />
        </div>
      </div>
      
      {/* Percentage display */}
      <motion.div 
        className="mt-6 text-4xl font-bold text-primary"
        key={clampedPercentage}
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {Math.round(clampedPercentage)}%
      </motion.div>
    </div>
  );
};

export default CylindricalGauge;
