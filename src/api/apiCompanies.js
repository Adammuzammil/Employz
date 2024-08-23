import supabaseClient, { supabaseUrl } from "@/utils/supabase";

export async function getCompanies(token) {
  //verify the user
  const supabase = await supabaseClient(token);

  //fetch query
  const { data, error } = await supabase.from("companies").select();

  if (error) {
    console.error("Error in fetching companies", error);
    return null;
  }

  return data;
}

export async function addNewCompany(token, _, companyData) {
  //verify the user
  const supabase = await supabaseClient(token);

  const random = Math.floor(Math.random() * 90000);
  const fileName = `logo-${random}-${companyData.name}`;

  const { error: storageError } = await supabase.storage
    .from("company-logo")
    .upload(fileName, companyData.logo);

  if (storageError) {
    console.error("Error in uploading company logo", error);
    return null;
  }

  const logo_url = `${supabaseUrl}/storage/v1/object/public/company-logo/${fileName}`;

  //fetch query
  const { data, error } = await supabase
    .from("companies")
    .insert({
      name: companyData.name,
      logo_url: logo_url,
    })
    .select();

  if (error) {
    console.error("Error in submitting companies", error);
    return null;
  }

  return data;
}
