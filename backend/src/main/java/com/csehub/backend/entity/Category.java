package com.csehub.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    /** Emoji or icon key shown in the sidebar and category page, e.g. "🧠" */
    @Column(length = 20)
    private String icon;

    /** Optional grouping used to render the sidebar (e.g. "LEARNING") */
    @Column(name = "group_name", length = 50)
    private String groupName;

    @Column(length = 255)
    private String description;

    /** User-controlled sort position, lower shows first. Nullable for legacy rows. */
    @Column(name = "display_order")
    private Integer displayOrder;

    // NOTE: intentionally NOT cascading REMOVE here. Deleting a category must
    // never silently delete the resources/sessions that reference it — that
    // safety check lives in CategoryService.delete(), which either blocks the
    // delete or reassigns children to another category first.
    @OneToMany(mappedBy = "category")
    @JsonIgnore
    private List<Resource> resources = new ArrayList<>();

    @OneToMany(mappedBy = "category")
    @JsonIgnore
    private List<Session> sessions = new ArrayList<>();

    public Category() {
    }

    public Category(String name, String icon, String groupName, String description) {
        this.name = name;
        this.icon = icon;
        this.groupName = groupName;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }

    public List<Resource> getResources() {
        return resources;
    }

    public void setResources(List<Resource> resources) {
        this.resources = resources;
    }

    public List<Session> getSessions() {
        return sessions;
    }

    public void setSessions(List<Session> sessions) {
        this.sessions = sessions;
    }
}
