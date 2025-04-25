import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Album } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Photofine Digital Album Generator</h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Create beautiful digital albums from your photos</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Link to="/create">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-gray-800">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <Album className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create New Album</h2>
                <p className="text-gray-500 dark:text-gray-400 text-center">Upload photos and create a new digital album</p>
              </div>
            </Card>
          </Link>

          <Link to="/albums">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-gray-800">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <Album className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">View Albums</h2>
                <p className="text-gray-500 dark:text-gray-400 text-center">Browse through your saved digital albums</p>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
