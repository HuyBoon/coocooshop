import HeaderTitle from "@/components/admin/HeaderTitle";
import React from "react";

const UserManagement = () => {
	return (
		<div>
			<HeaderTitle
				title="User Management"
				path="/admin/dashboard"
				addItem="Dashboard"
			/>
		</div>
	);
};

export default UserManagement;
