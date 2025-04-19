/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, StyleSheet, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import IssueList, { IssueAdd, BlackList, graphQLFetch } from './IssueList';
import Icon from 'react-native-vector-icons/Ionicons';

interface Issue {
  id: number;
  title: string;
  status: string;
  owner: string;
  created: string;
  effort: number;
  due?: string;
}

interface IssueInputs {
  title: string;
  owner: string;
  due?: string;
  effort?: number;
}


const Tab = createBottomTabNavigator();

function App(): React.JSX.Element {
  const [issues, setIssues] = useState<Issue[]>([]);

  const loadData = useCallback(async () => {
    const query = `query {
        issueList {
        id title status owner
        created effort due
        }
    }`;

    const data = await graphQLFetch(query);
    if (data && data.issueList) {
      setIssues(data.issueList);
    } else {
      Alert.alert("Error", "Failed to load issues.");
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]); // Run loadData when the component mounts and if loadData changes (it won't due to useCallback)

  const createIssue = async (issue: IssueInputs) => {
    const query = `mutation issueAdd($issue: IssueInputs!) {
        issueAdd(issue: $issue) {
        id
        }
    }`;

    const data = await graphQLFetch(query, { issue });
    if (data && data.issueAdd) {
      loadData(); // Reload data after adding an issue
    } else {
      Alert.alert("Error", "Failed to add issue.");
    }
  };

  return (
    <NavigationContainer>
      <SafeAreaView style={styles.safeArea}>
        <Tab.Navigator
          screenOptions={{
            headerStyle: styles.header,
            headerTitleStyle: styles.headerTitle,
            tabBarStyle: styles.tabBar,
            tabBarActiveTintColor: '#537791',
            tabBarInactiveTintColor: 'gray',
            headerShown: false,
          }}
        >
          <Tab.Screen
            name="Issues"
            options={{
              tabBarLabel: 'Issues', // Explicitly set tab label
              tabBarIcon: ({ color, size }) => (
                <Icon name="list" color={color} size={size} />
              )
            }}
          >
            {/* Pass issues state and loadData function */}
            {(props) => <IssueList {...props} issues={issues} loadData={loadData} />}
          </Tab.Screen>

          <Tab.Screen
            name="Add Issue"
            options={{
              tabBarLabel: 'Add Issue',
              tabBarIcon: ({ color, size }) => (
                <Icon name="add-circle" color={color} size={size} />
              )
            }}
          >
            {/* Pass createIssue function */}
            {(props) => <IssueAdd {...props} createIssue={createIssue} />}
          </Tab.Screen>

          <Tab.Screen
            name="Blacklist"
            component={BlackList}
            options={{
              tabBarLabel: 'Blacklist',
              tabBarIcon: ({ color, size }) => (
                <Icon name="ban" color={color} size={size} />
              )
            }}
          />
        </Tab.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    backgroundColor: '#537791',
  },
  headerTitle: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  tabBar: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#cccccc',
  },
});

export default App;
