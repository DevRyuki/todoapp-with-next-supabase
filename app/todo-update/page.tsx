import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/server"
import {revalidatePath} from "next/cache";

export default async function Page() {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore)

    const { data } = await supabase.from('todo').select('*').order('created_at', { ascending: false })

  // data : any[] | null
    if (!data) return (<div>データがありません。</div>)

  async function action(formData: FormData) {
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
      <main className={""}>
        <div className={"container"}>
          <div className={"max-w-5xl w-96 px-4 py-2 border rounded-md space-y-2"}>
            <h2>タスクを追加</h2>
            <form action={action} className={"flex flex-col gap-2"}>
              <input className={"border"} type="text" name="name" id="name"/>
              <textarea name={"detail"} className={"border"}/>
              <button className={"border"} type="submit">追加</button>
            </form>
          </div>

          {
            data.map((todo) => (
              <div key={todo.id}>
                <p>{todo.name}</p>
                <></>
              </div>
            ))}
        </div>
      </main>

    )
}
