import { useEffect, useState } from 'react';
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import React from 'react';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';
import { useStore } from '../../stores/store';
import { observable } from 'mobx';
import { observer } from 'mobx-react-lite';


function App() {
  //States

  const { activityStore } = useStore() 

  const [activities, setActivities] = useState<Activity[]>([]);
  const [submitting, setSubmitting] = useState(false)


  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore])

  function handleDeleteActivity(id: string) {
    setSubmitting(true)
    agent.Activities.delete(id).then(() => {
      setActivities([...activities.filter(x => x.id !== id)])
      setSubmitting(false)
    })

  }

  // function handleCreateOrEditActivity(activity: Activity) {
  //   setSubmitting(true)
  //   if (activity.id) {
  //     agent.Activities.update(activity).then(() => {
  //       setActivities([...activities.filter(x => x.id !== activity.id), activity])
  //       setSelectedActivity(activity)
  //       setEditMode(false)
  //       setSubmitting(false)
  //     })
  //   } else {
  //     activity.id = uuid()
  //     agent.Activities.create(activity).then(() => {
  //       setActivities([...activities, activity]);
  //       setSelectedActivity(activity)
  //       setEditMode(false)
  //       setSubmitting(false)
  //     })
  //   }
  // }
  if (activityStore.loadingInitial) return <LoadingComponent content={'Loading app'} />
  return (
    <>
      <NavBar />
      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard
          activities={activityStore.activities}
          deleteActivity={handleDeleteActivity}
          submitting={submitting}
        />
      </Container>
    </>
  );
}

export default observer(App);
