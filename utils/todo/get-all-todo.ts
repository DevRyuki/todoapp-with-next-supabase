
export default function getAllTodo() {
  return supabase.from<Database.Todo>("todo").select("*");
}