
import React from 'react';

const MobileWarning = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="glass-panel p-8 rounded-2xl max-w-md text-center space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Versione Desktop Raccomandata</h1>
        <p className="text-gray-600">
          Questa app è ottimizzata per l'utilizzo su desktop. Per la migliore esperienza, ti preghiamo di accedere da un computer.
        </p>
        <div className="text-sm text-gray-500">
          💻 Torna a visitarci dal tuo computer!
        </div>
      </div>
    </div>
  );
};

export default MobileWarning;
