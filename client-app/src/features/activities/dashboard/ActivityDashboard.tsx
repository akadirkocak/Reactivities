import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Grid } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../stores/store";
import ActivityList from './ActivityList';

export default observer(function ActivityDashboard() {
    const { activityStore } = useStore()
    //const {loadActivities, activityRegistry} = activityStore()
    const { loadActivities, activityRegistiry } = activityStore
    useEffect(() => {
        if (activityRegistiry.size <= 1) loadActivities();
    }, [loadActivities])

    if (activityStore.loadingInitial) return <LoadingComponent content={'Loading app'} />
    return (
        <Grid>
            <Grid.Column width='10'> 
                <ActivityList />
            </Grid.Column>
            <Grid.Column width='6'>
                {/* {selectedActivity && !editMode &&
                    <ActivityDetails />}
                {editMode &&
                    <ActivityForm />} */}
                <h2>Activity filters</h2>
            </Grid.Column>

        </Grid>
    )
})