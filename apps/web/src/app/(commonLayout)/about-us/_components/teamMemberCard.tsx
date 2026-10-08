import teamImage from "@/assets/images.jpg";
import { FacebookIcon, InstagramIcon, LinkedinIcon, XIcon } from "@/components/ui/BrandIcons";
import Image from "next/image";

const Team_Member_Card = ({
  member,
}: {
  member: { name: string; role: string; image: string };
}) => {
  const { name, role, image } = member;

  return (
    <div className="p-5 bg-default-50 rounded-lg shadow-lg hover:shadow-2xl transform transition-shadow duration-300 ease-in-out">
      <div className="flex justify-center items-center overflow-hidden rounded-md">
        <Image
          src={image || teamImage}
          alt={name}
          width={200}
          height={200}
          className="rounded-md transform transition-transform duration-300 ease-in-out hover:scale-110"
        />
      </div>
      <div className="text-center space-y-2 mt-4">
        <h3 className="text-2xl font-semibold text-default-800 hover:text-default-900">{name}</h3>
        <span className="text-default-500">{role}</span>
        <div className="flex items-center justify-center gap-5 mt-3">
          <FacebookIcon className="text-primary-fg hover:text-primary-fg cursor-pointer transition-colors duration-200" />
          <XIcon className="text-default-400 hover:text-primary-fg cursor-pointer transition-colors duration-200" />
          <InstagramIcon className="text-pink-600 hover:text-pink-800 cursor-pointer transition-colors duration-200" />
          <LinkedinIcon className="text-primary-fg hover:text-primary-fg cursor-pointer transition-colors duration-200" />
        </div>
      </div>
    </div>
  );
};

export default Team_Member_Card;
