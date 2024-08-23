import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PuffLoader } from "react-spinners";

const Onboarding = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const handleRoleSelection = async (role) => {
    await user
      .update({ unsafeMetadata: { role } })
      .then(() => {
        navigate(role === "recruiter" ? "/post-jobs" : "/jobs");
        //user_2kw1V8kM7HpiyjyWb7mIZzIu3Hq
      })
      .catch((err) => {
        console.error("Error updating role:", err);
      });
  };

  useEffect(() => {
    if (user?.unsafeMetadata?.role) {
      navigate(
        user?.unsafeMetadata?.role === "recruiter" ? "/post-jobs" : "/jobs"
      );
    }
  }, [user]);

  if (!isLoaded) {
    return <PuffLoader />;
  }

  console.log(user);
  return (
    <div className="flex flex-col items-center justify-center mt-32">
      <h2 className="gradient-title font-bold text-7xl sm:text-8xl tracking-tight">
        I am a...
      </h2>

      <div className="mt-16 grid grid-cols-2 gap-4 w-full md:px-40">
        <Button
          variant="blue"
          className="h-14 text-lg"
          onClick={() => handleRoleSelection("candidate")}
        >
          Candidate
        </Button>
        <Button
          variant="destructive"
          className="h-14 text-lg"
          onClick={() => handleRoleSelection("recruiter")}
        >
          Recruiter
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;
