package com.nckh.backend.modules.research.product;

import com.nckh.backend.modules.user.User;
import com.nckh.backend.modules.research.topic.ResearchTopic;
import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "[ResearchProducts]")
public class ResearchProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_name", columnDefinition = "nvarchar(500)", nullable = false)
    private String productName;

    @Column(name = "product_type", length = 50, nullable = false)
    private String productType;
    // PATENT, SOLUTION, BOOK_REFERENCE, BOOK_TEXTBOOK, SOFTWARE, OTHER

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "owner_id")
    private User owner;

    @Column(name = "owner_name", columnDefinition = "nvarchar(300)")
    private String ownerName;

    @Column(name = "serial_number", columnDefinition = "nvarchar(200)")
    private String serialNumber;

    @Temporal(TemporalType.DATE)
    @Column(name = "issued_at")
    private Date issuedAt;

    @Column(name = "publisher", columnDefinition = "nvarchar(300)")
    private String publisher;

    @Column(name = "issuing_authority", columnDefinition = "nvarchar(300)")
    private String issuingAuthority;

    @Column(name = "attachment_path", columnDefinition = "nvarchar(500)")
    private String attachmentPath;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id")
    private ResearchTopic topic;

    @Column(name = "status", length = 30)
    private String status = "CERTIFIED";

    @Column(name = "created_at")
    private Date createdAt = new Date();

    public ResearchProduct() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getProductType() { return productType; }
    public void setProductType(String productType) { this.productType = productType; }

    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public String getSerialNumber() { return serialNumber; }
    public void setSerialNumber(String serialNumber) { this.serialNumber = serialNumber; }

    public Date getIssuedAt() { return issuedAt; }
    public void setIssuedAt(Date issuedAt) { this.issuedAt = issuedAt; }

    public String getPublisher() { return publisher; }
    public void setPublisher(String publisher) { this.publisher = publisher; }

    public String getIssuingAuthority() { return issuingAuthority; }
    public void setIssuingAuthority(String issuingAuthority) { this.issuingAuthority = issuingAuthority; }

    public String getAttachmentPath() { return attachmentPath; }
    public void setAttachmentPath(String attachmentPath) { this.attachmentPath = attachmentPath; }

    public ResearchTopic getTopic() { return topic; }
    public void setTopic(ResearchTopic topic) { this.topic = topic; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
}
