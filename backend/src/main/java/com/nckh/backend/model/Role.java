package com.nckh.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Roles")
public class Role {
    @Id
    private Integer id;

    private String roleName;

    public Role() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getRoleName() { return roleName; }
    public void setRoleName(String roleName) { this.roleName = roleName; }
}
