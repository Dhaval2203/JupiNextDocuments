'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, message } from 'antd';

import DashboardStats from './DashboardStats';
import EmployeeTable from './EmployeeTable';
import EmployeeFormModal from './EmployeeFormModal';

import {
    getEmployees,
    addEmployee,
    updateEmployee,
} from '@/services/employeeApi';

export default function EmployeeManagementScreen() {
    const [employees, setEmployees] = useState([]);
    const [loadingTable, setLoadingTable] = useState(false);
    const [savingEmployee, setSavingEmployee] = useState(false);

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [isAddMode, setIsAddMode] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    /* ================= FETCH ================= */
    const fetchEmployees = async () => {
        try {
            setLoadingTable(true);
            const res = await getEmployees();
            setEmployees(res.data || []);
        } catch {
            message.error('Failed to load employees');
        } finally {
            setLoadingTable(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    /* ================= HANDLERS ================= */
    const handleAddNew = () => {
        setIsAddMode(true);
        setSelectedEmployee(null);
        setEditModalOpen(true);
    };

    const handleEdit = (record) => {
        setIsAddMode(false);
        setSelectedEmployee(record);
        setEditModalOpen(true);
    };

    const handleSaveEmployee = async (payload) => {
        try {
            setSavingEmployee(true);
            if (isAddMode) {
                await addEmployee(payload);
                message.success('Employee added successfully');
            } else {
                await updateEmployee(selectedEmployee.id, payload);
                message.success('Employee updated successfully');
            }
            setEditModalOpen(false);
            fetchEmployees();
        } catch (err) {
            if (err?.response?.status === 409) {
                message.error(err.response.data.message);
            } else {
                message.error('Failed to save employee');
            }
        } finally {
            setSavingEmployee(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC]" style={{ paddingTop: 80 }}>
            <DashboardStats dataSource={employees} />

            <Card style={{ maxWidth: 1400, margin: '0 auto', borderRadius: 16 }}>
                <EmployeeTable
                    employees={employees}
                    loading={loadingTable}
                    onAdd={handleAddNew}
                    onEdit={handleEdit}
                />
            </Card>

            <EmployeeFormModal
                open={editModalOpen}
                isAddMode={isAddMode}
                employee={selectedEmployee}
                employees={employees}
                loading={savingEmployee}
                onClose={() => setEditModalOpen(false)}
                onSave={handleSaveEmployee}
            />
        </div>
    );
}
