import React, { useState } from 'react';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  Button,
  useColorScheme,
  View,
  Dimensions,
} from 'react-native';

const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

function jsonDateReviver(key, value) {
  if (dateRegex.test(value)) return new Date(value);
  return value;
}

async function graphQLFetch(query, variables = {}) {
  try {
    /****** Q4: Start Coding here. State the correct IP/port******/
    const response = await fetch('http://192.168.1.6:3000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables })
      /****** Q4: Code Ends here******/
    });
    const body = await response.text();
    const result = JSON.parse(body, jsonDateReviver);

    if (result.errors) {
      const error = result.errors[0];
      if (error.extensions.code == 'BAD_USER_INPUT') {
        const details = error.extensions.exception.errors.join('\n ');
        alert(`${error.message}:\n ${details}`);
      } else {
        alert(`${error.extensions.code}: ${error.message}`);
      }
    }
    return result.data;
  } catch (e) {
    alert(`Error in sending data to server: ${e.message}`);
  }
}

export class IssueFilter extends React.Component {
  render() {
    return (
      <>
        {/****** Q1: Start Coding here. ******/}
        <Text style={styles.filterText}>This is a placeholder for the Issue Filter</Text>
        {/****** Q1: Code ends here ******/}
      </>
    );
  }
}

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 15,
    backgroundColor: '#fff'
  },
  header: {
    height: 45,
    backgroundColor: '#537791',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
    margin: 6
  },
  text: {
    textAlign: 'center',
    margin: 6,
    fontSize: 13,
  },
  dataWrapper: {
    marginTop: -1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#C1C0B9',
  },
  row: {
    height: 'auto',
    minHeight: 40,
    backgroundColor: '#E7E6E1',
    borderBottomWidth: 1,
    borderBottomColor: '#C1C0B9',
  },
  alternateRow: {
    height: 'auto',
    minHeight: 40,
    backgroundColor: '#F7F6E7',
    borderBottomWidth: 1,
    borderBottomColor: '#C1C0B9',
  },
  filterText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
    color: '#537791',
  },
  tableContainer: {
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  }
});

// Adjusted column widths based on screen width
const width = [
  screenWidth * 0.08,  // ID
  screenWidth * 0.15,  // Status
  screenWidth * 0.15,  // Owner
  screenWidth * 0.16,  // Created
  screenWidth * 0.1,   // Effort
  screenWidth * 0.16,  // Due Date
  screenWidth * 0.2,   // Title
];

function IssueRow(props) {
  const issue = props.issue;
  const isEven = props.index % 2 === 0;
  {/****** Q2: Coding Starts here. Create a row of data in a variable******/ }
  const rowData = [
    issue.id,
    issue.status,
    issue.owner,
    issue.created.toDateString(),
    issue.effort,
    issue.due ? issue.due.toDateString() : '',
    issue.title,
  ];
  {/****** Q2: Coding Ends here.******/ }
  return (
    <>
      {/****** Q2: Start Coding here. Add Logic to render a row  ******/}
      <Row
        data={rowData}
        widthArr={width}
        style={isEven ? styles.row : styles.alternateRow}
        textStyle={styles.text}
      />
      {/****** Q2: Coding Ends here. ******/}
    </>
  );
}


export function IssueTable(props) {
  const issueRows = props.issues.map((issue, index) =>
    <IssueRow key={issue.id} issue={issue} index={index} />
  );

  {/****** Q2: Start Coding here. Add Logic to initalize table header  ******/ }
  const tableHeader = ['ID', 'Status', 'Owner', 'Created', 'Effort', 'Due', 'Title'];
  {/****** Q2: Coding Ends here. ******/ }


  return (
    <View style={styles.tableContainer}>
      {/****** Q2: Start Coding here to render the table header/rows.**********/}
      <Table borderStyle={{ borderWidth: 0 }}>
        <Row
          data={tableHeader}
          widthArr={width}
          style={styles.header}
          textStyle={styles.headerText}
        />
        <ScrollView horizontal={true}>
          <TableWrapper style={styles.dataWrapper}>
            {/* Render the pre-mapped IssueRow components */}
            {issueRows}
          </TableWrapper>
        </ScrollView>
      </Table>
      {/****** Q2: Coding Ends here. ******/}
    </View>
  );
}


export class IssueAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    /****** Q3: Start Coding here. Create State to hold inputs******/
    this.state = { owner: '', title: '', effort: '', due: '' };
    this.onChangeOwner = this.onChangeOwner.bind(this);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeEffort = this.onChangeEffort.bind(this);
    this.onChangeDue = this.onChangeDue.bind(this);
    /****** Q3: Code Ends here. ******/
  }

  /****** Q3: Start Coding here. Add functions to hold/set state input based on changes in TextInput******/
  onChangeOwner(text) {
    this.setState({ owner: text });
  }

  onChangeTitle(text) {
    this.setState({ title: text });
  }

  onChangeEffort(text) {
    this.setState({ effort: text });
  }

  onChangeDue(text) {
    this.setState({ due: text });
  }
  /****** Q3: Code Ends here. ******/

  handleSubmit() {
    /****** Q3: Start Coding here. Create an issue from state variables and call createIssue. Also, clear input field in front-end******/
    const issue = {
      owner: this.state.owner,
      title: this.state.title,
      effort: this.state.effort ? parseInt(this.state.effort, 10) : undefined,
      due: this.state.due ? new Date(this.state.due) : undefined,
    };

    if (this.state.effort && isNaN(issue.effort)) {
      alert("Effort must be a number.");
      return;
    }
    if (this.state.due && isNaN(issue.due.getTime())) {
      alert("Invalid Due Date format. Please use YYYY-MM-DD.");
      return;
    }

    if (this.props.createIssue && typeof this.props.createIssue === 'function') {
      this.props.createIssue(issue);
      this.setState({ owner: '', title: '', effort: '', due: '' });
    } else {
      console.error("createIssue prop is not passed or is not a function");
      alert("Error: Could not submit issue.");
    }
    /****** Q3: Code Ends here. ******/
  }

  render() {
    return (
      <View style={{ padding: 10 }}>
        {/****** Q3: Start Coding here. Create TextInput field, populate state variables. Create a submit button, and on submit, trigger handleSubmit.*******/}
        <Text style={{ fontWeight: 'bold', marginBottom: 5, fontSize: 16, color: '#537791' }}>Add New Issue:</Text>
        <TextInput
          placeholder="Owner"
          style={{ borderWidth: 1, borderColor: 'gray', marginBottom: 5, padding: 8, borderRadius: 4 }}
          onChangeText={this.onChangeOwner}
          value={this.state.owner}
        />
        <TextInput
          placeholder="Title"
          style={{ borderWidth: 1, borderColor: 'gray', marginBottom: 5, padding: 8, borderRadius: 4 }}
          onChangeText={this.onChangeTitle}
          value={this.state.title}
        />
        <TextInput
          placeholder="Effort"
          style={{ borderWidth: 1, borderColor: 'gray', marginBottom: 5, padding: 8, borderRadius: 4 }}
          onChangeText={this.onChangeEffort}
          value={this.state.effort}
          keyboardType="numeric"
        />
        <TextInput
          placeholder="Due Date (YYYY-MM-DD)"
          style={{ borderWidth: 1, borderColor: 'gray', marginBottom: 10, padding: 8, borderRadius: 4 }}
          onChangeText={this.onChangeDue}
          value={this.state.due}
        />
        <Button
          title="Add Issue"
          onPress={this.handleSubmit}
          color="#537791"
        />
        {/****** Q3: Code Ends here. ******/}
      </View>
    );
  }
}

export class BlackList extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    /****** Q4: Start Coding here. Create State to hold inputs******/
    this.state = { name: '' };
    this.onChangeName = this.onChangeName.bind(this);
    /****** Q4: Code Ends here. ******/
  }
  /****** Q4: Start Coding here. Add functions to hold/set state input based on changes in TextInput******/
  onChangeName(text) {
    this.setState({ name: text });
  }
  /****** Q4: Code Ends here. ******/

  async handleSubmit() {
    /****** Q4: Start Coding here. Create an issue from state variables and issue a query. Also, clear input field in front-end******/
    const name = this.state.name;
    if (!name) {
      alert("Please enter a name to blacklist.");
      return;
    }
    console.log(`Attempting to blacklist: ${name}`); // Debug log

    const query = `mutation AddToBlacklist($name: String!) {
          addToBlacklist(nameInput: $name)
        }`;

    const variables = { name };

    // Use the graphQLFetch function defined earlier
    const data = await graphQLFetch(query, variables);

    if (data && data.addToBlacklist) {
      alert(`Successfully added ${name} to the blacklist.`);
      // Clear the input field
      this.setState({ name: '' });
    } else {
      // Error handling is done within graphQLFetch
      console.log('Blacklist addition might have failed. Check server logs or previous alerts.');
    }
    /****** Q4: Code Ends here. ******/
  }

  render() {
    return (
      <View style={{ padding: 10 }}>
        {/****** Q4: Start Coding here. Create TextInput field, populate state variables. Create a submit button, and on submit, trigger handleSubmit.*******/}
        <Text style={{ fontWeight: 'bold', marginBottom: 5, fontSize: 16, color: '#537791' }}>Add Owner to Blacklist:</Text>
        <TextInput
          placeholder="Owner Name"
          style={{ borderWidth: 1, borderColor: 'gray', marginBottom: 10, padding: 8, borderRadius: 4 }}
          onChangeText={this.onChangeName}
          value={this.state.name}
        />
        <Button
          title="Add to Blacklist"
          onPress={this.handleSubmit}
          color="#537791"
        />
        {/****** Q4: Code Ends here. ******/}
      </View>
    );
  }
}

export default class IssueList extends React.Component {
  render() {
    // Expects 'issues' prop from App.js
    const { issues } = this.props;
    return (
      // Use SafeAreaView for content within the screen
      <SafeAreaView style={styles.container}>
        <ScrollView>
          {/****** Q1: Start Coding here. ******/}
          <IssueFilter />
          {/****** Q1: Code ends here ******/}

          {/* Add some space between filter and table */}
          <View style={{ height: 10 }} />

          {/****** Q2: Start Coding here. ******/}
          {/* Pass issues prop */}
          <IssueTable issues={issues || []} />
          {/****** Q2: Code ends here ******/}

          {/* Removed IssueAdd and BlackList from here */}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

// Export graphQLFetch if needed elsewhere (e.g., App.js if logic moves)
export { graphQLFetch };
