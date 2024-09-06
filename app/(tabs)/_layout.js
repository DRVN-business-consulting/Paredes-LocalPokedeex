import {Tabs} from "expo-router";

export default function TabLayout(){
    return(
        <Tabs>
            <Tabs.Screen name='index'
            options={{
                title:'Pokemon List',
                headerShown: false,
            }}
/>
<Tabs.Screen name='groupList'
            options={{
                title:'Group List',
                
            }}
/>
            <Tabs.Screen name='Settings'
            option={{
                title:'Settings',
                headerShown: false,
            }}
            />
        </Tabs>
    )
}