import supabaseClient, { supabaseUrl } from "@/utils/supabase";

export async function applyToJob(token, _, jobData) {
  //verify the user
  const supabase = await supabaseClient(token);

  const random = Math.floor(Math.random() * 90000);
  const fileName = `resume-${random}-${jobData.candidate_id}`;

  const { error: storageError } = await supabase.storage
    .from("resumes")
    .upload(fileName, jobData.resume);

  if (storageError) {
    console.error("Error in uploading resume", error);
    return null;
  }

  //https://xzexahxkfcsiawcnluwz.supabase.co/storage/v1/object/public/company-logo/amazon.svg?t=2024-08-22T07%3A35%3A27.328Z

  const resume = `${supabaseUrl}/storage/v1/object/public/resumes/${fileName}`;

  //fetch query
  const { data, error } = await supabase
    .from("applications")
    .insert([
      {
        ...jobData,
        resume,
      },
    ])
    .select();

  if (error) {
    console.error("Error in applying jobs", error);
    return null;
  }

  return data;
}

export async function updateApplicationStatus(token, { job_id }, status) {
  //verify the user
  const supabase = await supabaseClient(token);
  //fetch query
  const { data, error } = await supabase
    .from("applications")
    .update({ status })
    .eq("job_id", job_id)
    .select();

  if (error || data.length === 0) {
    console.error("Error in updating application status", error);
    return null;
  }

  return data;
}

export async function getApplications(token, { user_id }) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("applications")
    .select("*, job:jobs(title, company:companies(name))")
    .eq("candidate_id", user_id);

  if (error) {
    console.error("Error fetching Applications:", error);
    return null;
  }

  return data;
}
