import React from 'react'
import IconSelector from '../IconSelector/IconSelector'
import dayjs from 'dayjs'
import { getMonthNameWithSuffix } from '../../UtilityFunctions'
import defualtImage from '../../assets/uploadImage.png'

const notifications = [
    {
        id: 1,
        type: "Reminder",
        title: "New Salesss",
        caption: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur delectus laudantium soluta vero iure atque totam, aut reiciendis nemo velit! Quidem, possimus voluptates, doloremque, minus dolor deleniti aspernatur temporibus dolore quis illum tempora inventore iusto culpa provident asperiores? Quisquam, earum laboriosam nihil molestiae temporibus, voluptates sapiente adipisci praesentium aut iure quibusdam at nulla placeat itaque atque veniam? Molestias, nobis? Qui maxime necessitatibus cumque aut aspernatur magnam quidem culpa voluptate earum nostrum quas similique doloribus veniam quam illum corporis, vero harum libero aliquid minus consequatur maiores quasi asperiores! Fugiat voluptate ea laboriosam assumenda explicabo excepturi nulla iusto. Tempore fugiat repellendus adipisci nihil, quis libero inventore soluta laudantium veritatis nam dolorum obcaecati excepturi sequi iure doloribus veniam quasi. Eos totam facere distinctio inventore, magnam, commodi non suscipit laboriosam itaque dolor eum nobis. Suscipit quibusdam, ullam eaque minima quo fugiat officiis, quasi voluptatibus adipisci facilis corrupti libero dolores optio autem laudantium. Molestiae doloremque nihil voluptatum eaque praesentium itaque cum dolor, culpa, suscipit vitae doloribus, et aperiam quam labore. Alias saepe harum sed aspernatur laudantium quidem dolores explicabo fugit blanditiis vero, expedita dolorum nam at excepturi voluptatem! Nostrum saepe omnis optio obcaecati, molestias commodi! Quos expedita magnam neque harum deleniti vitae quae est laudantium doloribus excepturi, inventore nulla fugiat illum exercitationem quo, cumque adipisci blanditiis tempore nostrum enim. Corrupti, et vero. Amet inventore sapiente deleniti explicabo ab. Expedita, corporis nobis! Eos nesciunt corporis sed deleniti nulla et maxime quia earum asperiores suscipit optio totam blanditiis accusantium numquam est enim, hic esse fuga saepe porro culpa rerum? Vel quia similique ab cum architecto laborum deleniti repudiandae nobis, minus maiores accusantium nemo maxime ipsum reprehenderit laudantium iusto iure. Alias itaque, doloribus quidem laborum soluta maxime dolores hic et nihil harum recusandae quisquam placeat ab praesentium inventore cum magnam ratione repudiandae in omnis, non molestiae? Quibusdam, quis?",
        selectDay : "2024-04-23",
        selectTime : "06:29",
        image: true,
    },
    {
        id: 2,
        type: "Reminder",
        title: "New Reminder",
        caption: "Reminder set for Aprill 19 2024 at 19:00",
        selectDay : "2024-04-23",
        selectTime : "06:29",
    },
    {
        id: 3,
        type: "Notify",
        title: "Delivery as been delayed",
        caption: "Lorem ipsum dolor sit amet, consectetur adipisicing elit  ",
        selectDay : "2024-04-23",
        selectTime : "06:29",
    },
]

const UserViewNotify = () => {
  return (
    <div className="flex flex-col gap-2 h-full overflow-auto p-2 ">
        {
            notifications.map((obj,index) => {

                let dateObj = dayjs(`${obj.selectDay}T${obj.selectTime}`)
                let { monthName,dayWithSuffix } = getMonthNameWithSuffix(dateObj.$M,dateObj.$D)

                console.log(monthName,dayWithSuffix);

                return (
                    <div className={`neutral p-2 rounded place-items- w-full grid grid-cols-[10%_90%] max-w-[700px]  `}>
                        <div className="pr-2 flex items-center justify-center">
                            {
                                obj.image ? (
                                    <img src={defualtImage} alt="" className="" />
                                ) : (
                                    <IconSelector type={obj.type} />
                                )
                            }
                        </div>
                        <div className="text-[12px] ">
                            <div className="font-bold primaryText text-base">{obj.title}</div>
                            <div className={` font-bold ${obj.caption.length > 50 ? "truncate" : ""} `}>{obj.caption}</div>
                            <div className=" ">{monthName} {dayWithSuffix}</div>
                            <div className={`${obj.repeat ? "flex items-center gap-1" : "hidden"} `}>
                                <IconSelector type={"Repeat"} size={15}/>
                                Every {obj.repeat}
                            </div>
                        </div>
                    </div>
                )
            })
        }
    </div>
  )
}

export default UserViewNotify