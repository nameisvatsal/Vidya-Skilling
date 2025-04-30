
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type CourseCardProps = {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  duration: string;
  level: string;
  language: string;
  progress?: number;
};

const CourseCard = ({
  id,
  title,
  description,
  image,
  category,
  duration,
  level,
  language,
  progress = 0,
}: CourseCardProps) => {
  return (
    <Link to={`/courses/${id}`}>
      <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg">
        <div className="aspect-video relative overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
          <Badge className="absolute top-2 right-2 bg-vidya-secondary">{level}</Badge>
        </div>
        
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className="text-vidya-primary border-vidya-primary">
              {category}
            </Badge>
            <span className="text-sm text-gray-500">{duration}</span>
          </div>
          
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{title}</h3>
          
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
            {description}
          </p>

          {progress > 0 && (
            <div className="mt-2">
              <div className="h-1.5 w-full bg-gray-200 rounded-full">
                <div
                  className="h-1.5 bg-vidya-primary rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-1 text-xs text-gray-500 text-right">
                {progress}% Complete
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="px-4 py-3 border-t flex justify-between bg-gray-50 dark:bg-gray-900">
          <Badge variant="outline" className="text-gray-600 dark:text-gray-400">
            {language}
          </Badge>
          <span className="text-sm text-vidya-primary font-medium">View Course</span>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default CourseCard;
