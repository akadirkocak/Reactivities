import { makeAutoObservable, runInAction } from "mobx"
import agent from "../app/api/agent"
import { Activity } from "../app/models/activity"
import { v4 as uuid } from 'uuid'

export default class ActivityStore {
    activityRegistiry = new Map<string, Activity>()
    selectedActivity: Activity | undefined = undefined
    editMode = false
    loading = false
    loadingInitial = false

    constructor() {
        makeAutoObservable(this)
    }

    get activitisByDate(){
        return Array.from(this.activityRegistiry.values()).sort((a,b)=> Date.parse(a.date) - Date.parse(b.date))
    }

    loadActivities = async () => {
        this.setLoadingInitial(true)
        try {
            const activities = await agent.Activities.list()
            activities.forEach(activity => {
                this.setActivity(activity)
            })
            this.setLoadingInitial(false)
        } catch (error) {
            console.log(error)
            this.setLoadingInitial(false)
        }
    }
    loadActivity = async (id: string) =>{
        let activity = this.getActivity(id)
        if(activity) {
            this.selectedActivity = activity
            return activity
        }
        else{
            this.setLoadingInitial(true)
            try {
                activity = await agent.Activities.details(id)
                this.setActivity(activity)
                runInAction(()=>{
                    this.selectedActivity = activity
                })
                this.setLoadingInitial(false)
                return activity
            } catch (error) {
                console.log(error)
                this.setLoadingInitial(false)
            }
        }
    }

    private setActivity = (activity: Activity) =>{
        activity.date = activity.date.split('T')[0]
        this.activityRegistiry.set(activity.id, activity)
    }
    private getActivity =(id:string) =>{
        return this.activityRegistiry.get(id)
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state
    }

    // selectActivity = (id: string) => {
    //     this.selectedActivity = this.activityRegistiry.get(id )
    // }

    // cancelSelectActivity = () => {
    //     this.selectedActivity = undefined
    // }

    // openForm = (id?: string) => {
    //     id ? this.selectActivity(id) : this.cancelSelectActivity();
    //     this.editMode = true
    // }

    // closeForm = () => {
    //     this.editMode = false
    // }

    createActivity = async (activity: Activity) => {
        this.loading = true
        activity.id = uuid();
        try {
            await agent.Activities.create(activity)
            runInAction(() => {
                this.activityRegistiry.set(activity.id,activity)
                this.selectedActivity = activity
                this.editMode = false
                this.loading = false
            })
        } catch (error) {
            console.log(error)
            runInAction(() => {
                this.loading = false
            })
        }
    }

    updateActivity = async (activity: Activity) => {
        this.loading = true
        try {
            await agent.Activities.update(activity)
            runInAction(() => {
                this.activityRegistiry.set(activity.id, activity)
                this.selectedActivity = activity
                this.editMode = false
                this.loading = false
            })
        } catch (error) {
            console.log(error)
            runInAction(() => {
                this.loading = false
            })
        }
    }

    deleteActivity = async (id: string) => {
        this.loading = true
        try {
            await agent.Activities.delete(id)
            runInAction(() => {
                this.activityRegistiry.delete(id)
                //if (this.selectedActivity?.id === id) this.cancelSelectActivity()
                this.loading = false
            })
        } catch (error) {
            console.log(error)
            runInAction(() => {
                this.loading = false
            })
        }
    }
}