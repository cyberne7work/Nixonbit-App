import React from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { apiRequest } from '@/utils/api';
import { useAuth } from '@clerk/clerk-expo';

interface WasteReport {
  id: string;
  description: string;
  location: { latitude: string; longitude: string; address: string };
  photo: string;
  status: string;
}

interface IssueCardProps {
  issue: WasteReport;
  onDelete: (id: string) => void;
  onEdit: (issue: WasteReport) => void;
}

const IssueCard: React.FC<IssueCardProps> = ({ issue, onDelete, onEdit }) => {
  const { getToken } = useAuth();

  const handleDelete = async () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this report?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await getToken();
              const response = await apiRequest(`/waste/${issue.id}`, 'DELETE', null, token);
              if (response.success) {
                onDelete(issue.id);
                Alert.alert('Success', 'Report deleted successfully.');
              } else {
                Alert.alert('Error', response.message || 'Failed to delete report.');
              }
            } catch (error) {
              console.error('Error deleting report:', error);
              Alert.alert('Error', 'Failed to delete report.');
            }
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    onEdit(issue);
  };

  const handleViewDetails = () => {
    router.push({
      pathname: '/(root)/(services)/issue-detail-screen',
      params: { issue: JSON.stringify(issue) },
    });
  };

  return (
    <TouchableOpacity style={styles.issueCard} onPress={handleViewDetails}>
      <Image source={{ uri: issue.photo }} style={styles.issuePhoto} />
      <View style={styles.issueDetails}>
        <Text style={styles.issueDescription}>{issue.description}</Text>
        <Text style={styles.issueStatus}>Status: {issue.status}</Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity onPress={handleEdit} style={styles.actionButton}>
          <MaterialIcons name="edit" size={20} color="#3470E4" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete} style={styles.actionButton}>
          <MaterialIcons name="delete" size={20} color="#FF4D4F" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = {
  issueCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  issuePhoto: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 15,
  },
  issueDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  issueDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
    fontFamily: 'Exo-Regular',
  },
  issueStatus: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    fontFamily: 'Exo-Regular',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: 10,
    padding: 5,
  },
};

export default IssueCard;