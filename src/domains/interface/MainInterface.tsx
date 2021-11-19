import { branchSwitch, getBranches, getHistory, push, commit } from '@domains/git/api';
import { BranchRecord, HistoryRecord } from '@domains/git/types';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

export default function MainInterface() {
  const isDarkMode = useColorScheme() === 'dark';
  const [syncing, setSyncing] = useState(false);
  const [performingCommit, setPerformingCommit] = useState(false);
  const [performingPush, setPerformingPush] = useState(false);
  const [historyRecords, setHistoryRecords] = useState<HistoryRecord[]>();
  const [localBranches, setLocalBranches] = useState<BranchRecord[]>();
  const [remoteBranches, setRemoteBranches] = useState<BranchRecord[]>();
  const [commitMessage, setCommitMessage] = useState('');

  const syncGitStatus = async () => {
    setSyncing(true);
    setHistoryRecords(await getHistory('LIMITED'));
    setLocalBranches(await getBranches());
    setRemoteBranches(await getBranches(true));
    setSyncing(false);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDarkMode ? '#222' : '#fff',
      }}
    >
      <View
        style={{
          height: 80,
          width: '100%',
          padding: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Image source={require('@app/assets/images/gitgit-logo.png')} style={{ height: 50, width: 87 }} />
        <TouchableOpacity
          style={{
            backgroundColor: 'limegreen',
            borderRadius: 4,
            padding: 12,
            alignItems: 'center',
            width: 140,
            height: 40,
          }}
          onPress={syncGitStatus}
        >
          {syncing ? <ActivityIndicator color="white" /> : <Text>Sync</Text>}
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ flex: 1, backgroundColor: 'tomato', paddingVertical: 20 }}>
          <ScrollView contentInsetAdjustmentBehavior="automatic">
            <Text style={{ fontWeight: 'bold', paddingHorizontal: 20, fontSize: 18, marginBottom: 8 }}>
              LOCAL
            </Text>
            <View style={{ marginBottom: 20 }}>
              {localBranches?.map((b) => (
                <TouchableOpacity
                  key={b.name}
                  style={{
                    paddingHorizontal: 20,
                    paddingVertical: 8,
                    backgroundColor: b.active ? 'green' : undefined,
                  }}
                  onPress={async () => {
                    branchSwitch(b.name);
                    setLocalBranches(await getBranches());
                  }}
                >
                  <Text key={b.name}>{b.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={{ fontWeight: 'bold', paddingHorizontal: 20, fontSize: 18, marginBottom: 8 }}>
              REMOTE
            </Text>
            <View>
              {remoteBranches?.map((b) => (
                <TouchableOpacity
                  key={b.name}
                  style={{
                    paddingHorizontal: 20,
                    paddingVertical: 8,
                    backgroundColor: b.active ? 'green' : undefined,
                  }}
                  onPress={async () => {
                    branchSwitch(b.name);
                    setLocalBranches(await getBranches());
                  }}
                >
                  <Text key={b.name}>{b.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
        <View style={{ flex: 2, backgroundColor: 'purple', padding: 20 }}>
          <ScrollView
            contentContainerStyle={{
              padding: 12,
            }}
          >
            {historyRecords?.map((r) => (
              <Text
                key={r.commitId}
                style={{
                  marginBottom: 16,
                }}
              >
                {r.commitMessage}
              </Text>
            ))}
          </ScrollView>
        </View>
        <View style={{ flex: 1, backgroundColor: 'red' }}>
          <View style={{ flex: 1, margin: 20, padding: 8, borderWidth: 2, borderRadius: 4 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 8 }}>Unstaged</Text>
          </View>
          <View style={{ flex: 1, margin: 20, padding: 8, borderWidth: 2, borderRadius: 4 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 8 }}>Staged</Text>
          </View>
          <View style={{ flex: 1, margin: 20, padding: 8, borderWidth: 2, borderRadius: 4 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 8 }}>Commit</Text>
            <TextInput
              style={{ flex: 1, marginBottom: 8, borderWidth: 1, padding: 8 }}
              selectionColor={'transparent'}
              placeholder="Commit message"
              placeholderTextColor="#777"
              onChangeText={(text) => setCommitMessage(text)}
              value={commitMessage}
            />
            <TouchableOpacity
              style={{
                backgroundColor: 'limegreen',
                borderRadius: 4,
                padding: 12,
                alignItems: 'center',
                width: '100%',
                height: 40,
                marginBottom: 8,
              }}
              onPress={async () => {
                await commit(commitMessage);
                alert('commit performed');
              }}
            >
              {performingCommit ? <ActivityIndicator color="white" /> : <Text>Commit</Text>}
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: 'limegreen',
                borderRadius: 4,
                padding: 12,
                alignItems: 'center',
                width: '100%',
                height: 40,
              }}
              onPress={async () => {
                await push();
                alert('pushed');
              }}
            >
              {performingPush ? <ActivityIndicator color="white" /> : <Text>Push</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={{ paddingHorizontal: 20, paddingVertical: 4, alignItems: 'flex-end' }}>
        <Text>0.1</Text>
      </View>
    </SafeAreaView>
  );
}
