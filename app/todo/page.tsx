import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/server"
import {revalidatePath} from "next/cache";

export default async function Page() {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore)

    const { data } = await supabase.from('todo').select('*').order('created_at', { ascending: false })

  // data : any[] | null
    if (!data) return (<div>データがありません。</div>)

  async function actionHandler(formData: FormData) {
    'use server'
    const cookieStore = cookies();
    const supabase = createClient(cookieStore)

    //formの入力を取得
    const values = {
      name: formData.get('name') as string,
    }

    const {error} = await supabase.from("todo").insert(values)

    if (error) throw new Error("Error:" + JSON.stringify(error))
    revalidatePath('/todo')
  }

    return (
      <div>
          <form action={actionHandler}>
            <input className={"border"} type="text" name="name" id="name" />
            <button className={"border"} type="submit">Submit</button>
          </form>

          {
              data.map((todo) => (
              <div key={todo.id}>
                  <p>{todo.name}</p>
              </div>
          ))}
      </div>
    )
}
